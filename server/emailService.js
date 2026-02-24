const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function formatItems(items) {
  return items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.product_name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">₹${item.subtotal.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');
}

function baseEmailTemplate(title, bodyContent) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:20px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <div style="background:#e53935;padding:24px 32px;">
          <h1 style="margin:0;color:#fff;font-size:22px;">Shyam Digi Services</h1>
          <p style="margin:4px 0 0;color:#ffcdd2;font-size:14px;">Shop No. 1, Bajaja Gali, Bakerganj, Patna - 800004</p>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 24px;color:#222;font-size:20px;">${title}</h2>
          ${bodyContent}
        </div>
        <div style="background:#f5f5f5;padding:16px 32px;text-align:center;">
          <p style="margin:0;color:#888;font-size:12px;">
            ShyamDigiServices | 7004383597 | shyamdigiservices@gmail.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendOrderConfirmationToCustomer(order, items) {
  if (!order.customer_email) return;

  const transporter = createTransporter();
  const itemsHtml = formatItems(items);

  const body = `
    <p style="color:#444;">Dear <strong>${order.customer_name}</strong>,</p>
    <p style="color:#444;">Thank you for your order! We have received your order and will process it shortly.</p>

    <div style="background:#f9f9f9;border-radius:6px;padding:16px;margin:20px 0;">
      <p style="margin:0 0 8px;"><strong>Order ID:</strong> #ORD${order.id}</p>
      <p style="margin:0 0 8px;"><strong>Date:</strong> ${new Date(order.created_at).toLocaleString('en-IN')}</p>
      <p style="margin:0 0 8px;"><strong>Payment Method:</strong> ${order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
      <p style="margin:0;"><strong>Payment Status:</strong> ${order.payment_status === 'paid' ? 'Paid' : 'Pending'}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <thead>
        <tr style="background:#e53935;color:#fff;">
          <th style="padding:10px 12px;text-align:left;">Product</th>
          <th style="padding:10px 12px;text-align:center;">Qty</th>
          <th style="padding:10px 12px;text-align:right;">Price</th>
          <th style="padding:10px 12px;text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:12px;text-align:right;font-weight:bold;">Total Amount:</td>
          <td style="padding:12px;text-align:right;font-weight:bold;font-size:16px;color:#e53935;">₹${order.total_amount.toLocaleString('en-IN')}</td>
        </tr>
      </tfoot>
    </table>

    <div style="background:#f9f9f9;border-radius:6px;padding:16px;margin:20px 0;">
      <p style="margin:0 0 4px;"><strong>Delivery Address:</strong></p>
      <p style="margin:0;color:#555;">${order.customer_address}</p>
    </div>

    <p style="color:#444;">Expected delivery: <strong>within 2 days</strong>.</p>
    <p style="color:#444;">For any queries, contact us at <a href="tel:+917004383597" style="color:#e53935;">7004383597</a> or WhatsApp us at <a href="https://wa.me/917004383597" style="color:#25d366;">7004383597</a>.</p>
  `;

  await transporter.sendMail({
    from: `"Shyam Digi Services" <${process.env.EMAIL_USER}>`,
    to: order.customer_email,
    subject: `Order Confirmed - #ORD${order.id} | ShyamDigiServices`,
    html: baseEmailTemplate('Order Confirmation', body),
  });
}

async function sendOrderSummaryToOwner(order, items) {
  const transporter = createTransporter();
  const itemsHtml = formatItems(items);

  const body = `
    <p style="color:#444;">A new order has been placed on ShyamDigiServices.</p>

    <div style="background:#fff3e0;border-left:4px solid #e53935;padding:16px;margin:20px 0;border-radius:4px;">
      <p style="margin:0 0 8px;font-size:18px;"><strong>Order #ORD${order.id}</strong></p>
      <p style="margin:0;color:#888;font-size:14px;">${new Date(order.created_at).toLocaleString('en-IN')}</p>
    </div>

    <h3 style="color:#333;">Customer Details</h3>
    <table style="width:100%;border-collapse:collapse;margin:12px 0;">
      <tr><td style="padding:6px 0;color:#888;width:140px;">Name</td><td style="padding:6px 0;"><strong>${order.customer_name}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;"><a href="tel:+91${order.customer_phone}" style="color:#e53935;">${order.customer_phone}</a></td></tr>
      <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;">${order.customer_email || 'Not provided'}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Address</td><td style="padding:6px 0;">${order.customer_address}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Payment</td><td style="padding:6px 0;">${order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online (Razorpay)'}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Status</td><td style="padding:6px 0;">${order.payment_status === 'paid' ? '<span style="color:#2e7d32;">Paid</span>' : '<span style="color:#e65100;">Pending</span>'}</td></tr>
    </table>

    <h3 style="color:#333;">Order Items</h3>
    <table style="width:100%;border-collapse:collapse;margin:12px 0;">
      <thead>
        <tr style="background:#e53935;color:#fff;">
          <th style="padding:10px 12px;text-align:left;">Product</th>
          <th style="padding:10px 12px;text-align:center;">Qty</th>
          <th style="padding:10px 12px;text-align:right;">Price</th>
          <th style="padding:10px 12px;text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr style="background:#f5f5f5;">
          <td colspan="3" style="padding:12px;text-align:right;font-weight:bold;">Total Amount:</td>
          <td style="padding:12px;text-align:right;font-weight:bold;font-size:18px;color:#e53935;">₹${order.total_amount.toLocaleString('en-IN')}</td>
        </tr>
      </tfoot>
    </table>

    ${order.razorpay_payment_id ? `<p style="color:#444;"><strong>Razorpay Payment ID:</strong> ${order.razorpay_payment_id}</p>` : ''}
  `;

  await transporter.sendMail({
    from: `"ShyamDigi Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Order #ORD${order.id} | ₹${order.total_amount.toLocaleString('en-IN')} | ${order.payment_method}`,
    html: baseEmailTemplate(`New Order Received - #ORD${order.id}`, body),
  });
}

module.exports = { sendOrderConfirmationToCustomer, sendOrderSummaryToOwner };
