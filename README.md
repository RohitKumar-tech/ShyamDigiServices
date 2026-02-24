# Shyam Digi Services

A full-stack e-commerce web application for **Shyam Digi Services** — an online store offering electronic accessories, mobile accessories, cables, adapters, and more.

---

## Features

- **Product Catalog** — Browse products organized by categories
- **Category Pages** — Dedicated pages per product category
- **Product Detail Pages** — Full product info with add-to-cart
- **Shopping Cart** — Add, remove, and update quantities
- **Checkout** — Supports two payment modes:
  - **COD (Cash on Delivery)**
  - **Online Payment via Razorpay**
- **Order Confirmation** — Order success page with order details
- **Email Notifications** — Auto email to customer and store owner on order placement
- **Contact Page** — Inquiry form for customer support
- **Responsive Design** — Mobile-friendly layout

---

## Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React 18, React Router v6, React Icons |
| Backend   | Node.js, Express.js                  |
| Database  | SQLite (via better-sqlite3)          |
| Payments  | Razorpay                             |
| Email     | Nodemailer (Gmail SMTP)              |

---

## Project Structure

```
ShyamDigiServices/
├── client/                   # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── HeroBanner.js
│   │   │   ├── CategoryBanner.js
│   │   │   └── ProductCard.js
│   │   ├── pages/            # Page-level components
│   │   │   ├── HomePage.js
│   │   │   ├── CategoryPage.js
│   │   │   ├── ProductPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── OrderSuccessPage.js
│   │   │   └── ContactPage.js
│   │   ├── context/
│   │   │   └── CartContext.js  # Global cart state
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                   # Express backend
│   ├── index.js              # Main server & API routes
│   ├── database.js           # SQLite DB connection
│   ├── emailService.js       # Nodemailer email functions
│   ├── seed.js               # Database seeder
│   ├── .env.example          # Environment variable template
│   └── package.json
├── package.json              # Root scripts (dev, build, seed)
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm v8 or higher

### 1. Clone the repository

```bash
git clone https://github.com/RohitKumar-tech/ShyamDigiServices.git
cd ShyamDigiServices
```

### 2. Install all dependencies

```bash
npm run install:all
```

This installs dependencies for both `client/` and `server/`.

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in your values:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password_here
PORT=5000
```

> **Note:** For Gmail, generate an [App Password](https://myaccount.google.com/apppasswords) (requires 2-Step Verification).

### 4. Seed the database

```bash
npm run seed
```

This populates the SQLite database with initial categories and products.

### 5. Run in development mode

```bash
npm run dev
```

This starts both the backend server (port 5000) and React dev server (port 3000) concurrently.

### 6. Build for production

```bash
cd client && npm run build
```

Then start the production server:

```bash
npm start
```

The server will serve the React build and API from port 5000.

---

## API Endpoints

| Method | Endpoint                        | Description                      |
|--------|---------------------------------|----------------------------------|
| GET    | `/api/categories`               | Get all categories               |
| GET    | `/api/categories/:slug`         | Get a single category            |
| GET    | `/api/products`                 | Get all products (filter by category/search) |
| GET    | `/api/products/:slug`           | Get a single product             |
| GET    | `/api/homepage`                 | Get all categories with products |
| POST   | `/api/inquiries`                | Submit a contact inquiry         |
| POST   | `/api/orders`                   | Place a COD order                |
| GET    | `/api/orders/:id`               | Get order details                |
| POST   | `/api/razorpay/create-order`    | Create a Razorpay payment order  |
| POST   | `/api/razorpay/verify`          | Verify Razorpay payment          |

---

## Environment Variables

| Variable              | Description                                  |
|-----------------------|----------------------------------------------|
| `RAZORPAY_KEY_ID`     | Razorpay API Key ID                          |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret                      |
| `EMAIL_USER`          | Gmail address used for sending emails        |
| `EMAIL_PASS`          | Gmail App Password                           |
| `PORT`                | Server port (default: 5000)                  |

---

## License

This project is proprietary and owned by **Shyam Digi Services**. All rights reserved.
