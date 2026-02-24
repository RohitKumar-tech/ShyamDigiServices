require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const db = require('./database');
const { sendOrderConfirmationToCustomer, sendOrderSummaryToOwner } = require('./emailService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes

// Get all categories
app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY display_order').all();
  res.json(categories);
});

// Get single category by slug
app.get('/api/categories/:slug', (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

// Get all products (optionally filtered by category)
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;
  const params = [];

  if (category) {
    query += ' WHERE c.slug = ?';
    params.push(category);
  } else if (search) {
    query += ' WHERE p.name LIKE ?';
    params.push(`%${search}%`);
  }

  query += ' ORDER BY c.display_order, p.display_order';

  const products = db.prepare(query).all(...params);
  res.json(products);
});

// Get single product by slug
app.get('/api/products/:slug', (req, res) => {
  const product = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ?
  `).get(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Submit inquiry
app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }
  const result = db.prepare(
    'INSERT INTO inquiries (name, email, phone, message) VALUES (?, ?, ?, ?)'
  ).run(name, email || null, phone, message || null);
  res.json({ success: true, id: result.lastInsertRowid });
});

// Get all products grouped by category (for homepage)
app.get('/api/homepage', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY display_order').all();
  const products = db.prepare(`
    SELECT p.*, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY c.display_order, p.display_order
  `).all();

  const grouped = categories.map(cat => ({
    ...cat,
    products: products.filter(p => p.category_slug === cat.slug)
  }));

  res.json(grouped);
});

// ─── ORDER ROUTES ────────────────────────────────────────────────────────────

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  res.json({ order, items });
});

// Create order (COD)
app.post('/api/orders', async (req, res) => {
  const { customer_name, customer_email, customer_phone, customer_address, items } = req.body;

  if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const total_amount = items.reduce((sum, item) => sum + item.subtotal, 0);

  const orderResult = db.prepare(`
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, payment_method, payment_status, total_amount)
    VALUES (?, ?, ?, ?, 'COD', 'pending', ?)
  `).run(customer_name, customer_email || null, customer_phone, customer_address, total_amount);

  const orderId = orderResult.lastInsertRowid;

  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const item of items) {
    insertItem.run(orderId, item.product_id, item.product_name, item.price, item.quantity, item.subtotal);
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  // Send emails (non-blocking)
  sendOrderConfirmationToCustomer(order, orderItems).catch(err => console.error('Customer email error:', err));
  sendOrderSummaryToOwner(order, orderItems).catch(err => console.error('Owner email error:', err));

  res.json({ success: true, orderId });
});

// ─── RAZORPAY ROUTES ─────────────────────────────────────────────────────────

// Create Razorpay order
app.post('/api/razorpay/create-order', async (req, res) => {
  const { customer_name, customer_email, customer_phone, customer_address, items } = req.body;

  if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const total_amount = items.reduce((sum, item) => sum + item.subtotal, 0);

  // Save pending order to DB first
  const orderResult = db.prepare(`
    INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, payment_method, payment_status, total_amount)
    VALUES (?, ?, ?, ?, 'ONLINE', 'pending', ?)
  `).run(customer_name, customer_email || null, customer_phone, customer_address, total_amount);

  const orderId = orderResult.lastInsertRowid;

  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const item of items) {
    insertItem.run(orderId, item.product_id, item.product_name, item.price, item.quantity, item.subtotal);
  }

  try {
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total_amount * 100), // paise
      currency: 'INR',
      receipt: `order_${orderId}`,
    });

    // Save razorpay_order_id
    db.prepare('UPDATE orders SET razorpay_order_id = ? WHERE id = ?').run(razorpayOrder.id, orderId);

    res.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order. Please use COD or try again.' });
  }
});

// Verify Razorpay payment
app.post('/api/razorpay/verify', async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  db.prepare(`
    UPDATE orders SET payment_status = 'paid', razorpay_payment_id = ?, status = 'confirmed' WHERE id = ?
  `).run(razorpay_payment_id, orderId);

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  // Send emails (non-blocking)
  sendOrderConfirmationToCustomer(order, orderItems).catch(err => console.error('Customer email error:', err));
  sendOrderSummaryToOwner(order, orderItems).catch(err => console.error('Owner email error:', err));

  res.json({ success: true, orderId });
});

// Catch-all: serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Shyam Digi Services server running on port ${PORT}`);
});
