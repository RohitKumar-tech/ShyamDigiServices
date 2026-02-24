const db = require('./database');

// Clear existing data
db.exec('DELETE FROM products');
db.exec('DELETE FROM categories');

const insertCategory = db.prepare(
  'INSERT INTO categories (name, slug, description, image, display_order) VALUES (?, ?, ?, ?, ?)'
);

const insertProduct = db.prepare(
  'INSERT INTO products (name, slug, category_id, price, mrp, description, image, badge, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

const seedData = db.transaction(() => {
  // Categories
  const categories = [
    { name: 'ONT Routers', slug: 'ont-routers', description: 'Single Band & Dual Band ONT Routers at Low Cost', image: '/images/ont-router.jpg', order: 1 },
    { name: 'SFP Modules', slug: 'sfp-modules', description: '9 DBM Pon SFP and Uplink/Downlink SFP Modules', image: '/images/sfp.jpg', order: 2 },
    { name: 'Fiber Testing Equipment', slug: 'fiber-testing', description: 'Fiber Cleaver, Stripper, Power Metre & OTDR', image: '/images/fiber-testing.jpg', order: 3 },
    { name: 'Fiber Extensions', slug: 'fiber-extensions', description: 'Fiber Connectivity Products', image: '/images/fiber-ext.jpg', order: 4 },
    { name: 'Range Extenders & Routers', slug: 'range-extenders', description: 'WiFi Routers and Range Extenders', image: '/images/router.jpg', order: 5 },
    { name: 'Aluminum Telescopic Ladders', slug: 'ladders', description: 'Heavy Duty Aluminum Telescopic Ladders', image: '/images/ladder.jpg', order: 6 },
    { name: 'Power Supply', slug: 'power-supply', description: 'Power Adapters and Converters', image: '/images/power.jpg', order: 7 },
    { name: 'EPON & GPON OLT', slug: 'epon-gpon-olt', description: 'EPON and GPON OLT Systems', image: '/images/olt.jpg', order: 8 },
    { name: 'Splicing Machines', slug: 'splicing-machines', description: 'Fiber Optic Splicing Machines', image: '/images/splicing.jpg', order: 9 },
    { name: 'Landline Phones', slug: 'landline-phones', description: 'Beetal Brand Landline Phones', image: '/images/phone.jpg', order: 10 },
  ];

  const catIds = {};
  for (const cat of categories) {
    const info = insertCategory.run(cat.name, cat.slug, cat.description, cat.image, cat.order);
    catIds[cat.slug] = info.lastInsertRowid;
  }

  // Products
  const products = [
    // Range Extenders & Routers
    { name: 'Mi 4A Gigabit Router', slug: 'mi-4a-gigabit', catSlug: 'range-extenders', price: 1080, mrp: 1499, desc: 'Xiaomi Mi 4A Gigabit Edition Router, Dual Band 2.4/5GHz', badge: null, order: 1 },
    { name: 'Mi Router 4C 2.4 GHz', slug: 'mi-router-4c', catSlug: 'range-extenders', price: 650, mrp: 999, desc: 'Xiaomi Mi Router 4C, 2.4GHz, 300Mbps', badge: null, order: 2 },
    { name: 'Renew TP-Link C20 2.4/5GHz', slug: 'tplink-c20', catSlug: 'range-extenders', price: 499, mrp: 899, desc: 'Renewed TP-Link Archer C20 Dual Band Router', badge: null, order: 3 },
    { name: 'Renew TP-Link RE200 2.5/5GHz', slug: 'tplink-re200', catSlug: 'range-extenders', price: 650, mrp: 1099, desc: 'Renewed TP-Link RE200 AC750 Range Extender', badge: null, order: 4 },
    { name: 'Renew TP-Link C6', slug: 'tplink-c6', catSlug: 'range-extenders', price: 850, mrp: 1399, desc: 'Renewed TP-Link Archer C6 Dual Band Gigabit Router', badge: null, order: 5 },
    { name: 'Renew Tenda N301', slug: 'tenda-n301', catSlug: 'range-extenders', price: 260, mrp: 499, desc: 'Renewed Tenda N301 Wireless N300 Router', badge: null, order: 6 },
    { name: 'Renew TP-Link C5', slug: 'tplink-c5', catSlug: 'range-extenders', price: 480, mrp: 799, desc: 'Renewed TP-Link Archer C5 AC1200 Dual Band Router', badge: null, order: 7 },
    { name: 'Renew Tenda AC10 Gigabit', slug: 'tenda-ac10', catSlug: 'range-extenders', price: 680, mrp: 1199, desc: 'Renewed Tenda AC10 AC1200 Smart Dual Band Gigabit Router', badge: null, order: 8 },

    // Aluminum Telescopic Ladders
    { name: '10.5 Feet Aluminum Telescopic Ladder', slug: 'ladder-10-5ft', catSlug: 'ladders', price: 4950, mrp: 5999, desc: 'Heavy Duty 10.5 Feet Aluminum Telescopic Ladder', badge: null, order: 1 },
    { name: '12.6 Feet Aluminum Telescopic Ladder', slug: 'ladder-12-6ft', catSlug: 'ladders', price: 5450, mrp: 6499, desc: 'Heavy Duty 12.6 Feet Aluminum Telescopic Ladder', badge: null, order: 2 },
    { name: '15 Feet Aluminum Telescopic Ladder', slug: 'ladder-15ft', catSlug: 'ladders', price: 6750, mrp: 7999, desc: 'Heavy Duty 15 Feet Aluminum Telescopic Ladder', badge: null, order: 3 },
    { name: '17 Feet Aluminum Telescopic Ladder', slug: 'ladder-17ft', catSlug: 'ladders', price: 7650, mrp: 8999, desc: 'Heavy Duty 17 Feet Aluminum Telescopic Ladder', badge: null, order: 4 },
    { name: '20.34 Feet Aluminum Telescopic Ladder', slug: 'ladder-20ft', catSlug: 'ladders', price: 8850, mrp: 9999, desc: 'Heavy Duty 20.34 Feet Aluminum Telescopic Ladder', badge: null, order: 5 },

    // Fiber Testing Equipment
    { name: 'PC-09 Magnet Cleaver', slug: 'pc09-cleaver', catSlug: 'fiber-testing', price: 2390, mrp: 2999, desc: 'PC-09 Magnet Fiber Optical Cleaver', badge: 'Most Selling', order: 1 },
    { name: 'Fiber Optical Cleaver (48,000 Blade Life)', slug: 'fiber-cleaver-48k', catSlug: 'fiber-testing', price: 2850, mrp: 3499, desc: 'Fiber Optical Cleaver with 48,000 blade life', badge: null, order: 2 },
    { name: 'DBC Power Meter with VFL (Rechargeable)', slug: 'dbc-power-meter', catSlug: 'fiber-testing', price: 1850, mrp: 2499, desc: 'DBC Optical Power Meter with Visual Fault Locator, Rechargeable', badge: null, order: 3 },
    { name: 'Optical Power Metre', slug: 'optical-power-metre', catSlug: 'fiber-testing', price: 850, mrp: 1199, desc: 'Optical Power Metre for Fiber Testing', badge: null, order: 4 },
    { name: 'Renew Uniway H85 Cleaver', slug: 'uniway-h85', catSlug: 'fiber-testing', price: 1499, mrp: 1999, desc: 'Renewed Uniway H85 Fiber Cleaver', badge: null, order: 5 },

    // Power Supply
    { name: '12V 1.5Amp Power Supply', slug: '12v-1-5amp', catSlug: 'power-supply', price: 65, mrp: 99, desc: '12V 1.5Amp DC Power Adapter', badge: null, order: 1 },
    { name: '12V 2Amp Power Supply', slug: '12v-2amp', catSlug: 'power-supply', price: 72, mrp: 120, desc: '12V 2Amp DC Power Adapter', badge: null, order: 2 },
    { name: '12V 1Amp Power Supply', slug: '12v-1amp', catSlug: 'power-supply', price: 57, mrp: 89, desc: '12V 1Amp DC Power Adapter', badge: null, order: 3 },
    { name: 'Power Adaptor for 24V Devices', slug: '24v-adaptor', catSlug: 'power-supply', price: 260, mrp: 399, desc: 'Power Adapter for 24V Devices', badge: null, order: 4 },
    { name: '48V DC to 220V AC Converter (Kinley Brand)', slug: '48v-converter', catSlug: 'power-supply', price: 1500, mrp: 1999, desc: '48V DC to 220V AC Power Converter - Kinley Brand', badge: null, order: 5 },

    // EPON & GPON OLT
    { name: 'Syrotech 4Port EPON OLT', slug: 'syrotech-4p-epon', catSlug: 'epon-gpon-olt', price: 22000, mrp: 26000, desc: 'Syrotech 4 Port EPON OLT System', badge: null, order: 1 },
    { name: 'DIGISOL 4Port EPON OLT', slug: 'digisol-4p-epon', catSlug: 'epon-gpon-olt', price: 24800, mrp: 28000, desc: 'Digisol 4 Port EPON OLT System', badge: null, order: 2 },
    { name: 'Syrotech 8Port EPON OLT', slug: 'syrotech-8p-epon', catSlug: 'epon-gpon-olt', price: 38000, mrp: 44000, desc: 'Syrotech 8 Port EPON OLT System', badge: null, order: 3 },
    { name: 'Syrotech 8Port GPON OLT Full Loaded', slug: 'syrotech-8p-gpon', catSlug: 'epon-gpon-olt', price: 52000, mrp: 60000, desc: 'Syrotech 8 Port GPON OLT System Full Loaded', badge: null, order: 4 },
    { name: 'Secureye 4Port EPON OLT (Vsol Chipset)', slug: 'secureye-4p-epon', catSlug: 'epon-gpon-olt', price: 25500, mrp: 29000, desc: 'Secureye 4 Port EPON OLT with Vsol Chipset', badge: null, order: 5 },
    { name: 'Khwahish 4 EPON OLT (Vsol Chipset)', slug: 'khwahish-4-epon', catSlug: 'epon-gpon-olt', price: 15800, mrp: 18000, desc: 'Khwahish 4 Port EPON OLT with Vsol Chipset', badge: null, order: 6 },

    // Splicing Machines
    { name: 'Fujikura 33s+ Splicing Machine', slug: 'fujikura-33s', catSlug: 'splicing-machines', price: 125000, mrp: 145000, desc: 'Fujikura 33s+ Fiber Optic Splicing Machine', badge: 'Most Selling', order: 1 },
    { name: 'Fujikura 43+ Splicing Machine', slug: 'fujikura-43', catSlug: 'splicing-machines', price: 145000, mrp: 165000, desc: 'Fujikura 43+ Fiber Optic Splicing Machine', badge: null, order: 2 },
    { name: 'Uniway H55 Splicing Machine', slug: 'uniway-h55', catSlug: 'splicing-machines', price: 42000, mrp: 50000, desc: 'Uniway H55 Fiber Optic Splicing Machine', badge: 'Lowest Rate', order: 3 },
    { name: 'Fujikura 48s+ Splicing Machine', slug: 'fujikura-48s', catSlug: 'splicing-machines', price: 166999, mrp: 185000, desc: 'Fujikura 48s+ Fiber Optic Splicing Machine (Including GST)', badge: null, order: 4 },

    // Landline Phones
    { name: 'M-71 Beetal Landline Phone', slug: 'beetal-m71', catSlug: 'landline-phones', price: 580, mrp: 799, desc: 'Beetal M-71 Corded Landline Phone', badge: null, order: 1 },
    { name: 'Beetal C51 Landline Phone', slug: 'beetal-c51', catSlug: 'landline-phones', price: 450, mrp: 599, desc: 'Beetal C51 Corded Landline Phone', badge: null, order: 2 },
    { name: 'Beetal X90 Cordless Landline Phone', slug: 'beetal-x90', catSlug: 'landline-phones', price: 1850, mrp: 2499, desc: 'Beetal X90 Cordless Landline Phone', badge: null, order: 3 },
    { name: 'Beetal C11 Landline Phone', slug: 'beetal-c11', catSlug: 'landline-phones', price: 350, mrp: 499, desc: 'Beetal C11 Corded Landline Phone', badge: null, order: 4 },
  ];

  for (const p of products) {
    const catId = catIds[p.catSlug];
    insertProduct.run(p.name, p.slug, catId, p.price, p.mrp, p.desc, `/images/${p.slug}.jpg`, p.badge, p.order);
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
});

seedData();
console.log('Database seeded successfully!');
