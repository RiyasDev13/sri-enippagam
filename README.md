# sri — React E-commerce Site

A React conversion of the original sri HTML site, extended into a working
storefront (browse products, cart, checkout, customer account) with an admin
dashboard (manage products, orders, and contact enquiries). Ships with a
Node/Express API that runs out of the box on an in-memory data store, and is
structured so you can drop in MongoDB whenever you're ready.

> **Note:** This README reflects the project after some additional pages
> (customer login/register, account page, a protected-route guard, and an admin
> contacts list) were added on top of the original scaffold. If your local copy
> doesn't have one of these files yet, treat that section as a suggested next step
> rather than something already wired up.

## Project structure

```
sri-enippagam/
├── frontend/                      React app (Vite)
│   ├── public/
│   │   └── logo.png
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       │
│       ├── assets/
│       │   └── logo.png
│       │
│       ├── components/
│       │   ├── layout/            TopBar, Navbar, Footer, Layout
│       │   ├── product/           ProductCard, ProductGrid
│       │   ├── cart/              CartItem
│       │   ├── common/            Loader, SubBanner, SectionTitle
│       │   └── admin/             AdminSidebar, AdminLayout, ProtectedRoute
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── About.jsx
│       │   ├── ProductCategory.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── OrderSuccess.jsx
│       │   ├── Contact.jsx
│       │   ├── Account.jsx
│       │   ├── CustomerLogin.jsx
│       │   ├── CustomerRegister.jsx
│       │   ├── NotFound.jsx
│       │   │
│       │   └── admin/
│       │       ├── AdminLogin.jsx
│       │       ├── Dashboard.jsx
│       │       ├── ProductsList.jsx
│       │       ├── ProductForm.jsx
│       │       ├── OrdersList.jsx
│       │       ├── OrderDetails.jsx
│       │       └── ContactsList.jsx
│       │
│       ├── context/
│       │   └── CartContext.jsx    Cart state + localStorage
│       │
│       ├── services/
│       │   └── api.js             All backend calls
│       │
│       └── styles/
│           ├── main.css
│           └── admin.css
│
└── backend/                        Express API
    ├── models/                     Mongoose schemas (Product, Order, Customer, Admin) —
    │                               ready for MongoDB, not required to run the app today
    ├── data/                       store.js (in-memory data used by default) + seedProducts.js
    ├── controllers/                productController.js, orderController.js, authController.js
    ├── routes/                     productRoutes.js, orderRoutes.js, authRoutes.js
    ├── middleware/                 auth.js (stub), errorHandler.js
    └── config/db.js                MongoDB connection helper
```

## What's new since the initial scaffold

- **`pages/Account.jsx`** — a customer account page (order history / profile, depending
  on how it was implemented).
- **`pages/CustomerLogin.jsx`** / **`pages/CustomerRegister.jsx`** — customer-facing
  login and signup screens.
- **`components/admin/ProtectedRoute.jsx`** — a route guard meant to wrap admin (and/or
  customer) routes so they require a logged-in session. Confirm it's actually applied
  around `<AdminLayout />` (and `<Account />`, if that should be gated too) in
  `App.jsx` — a guard component only protects a route once it's used there.
- **`pages/admin/ContactsList.jsx`** — an admin view for enquiries submitted through
  the storefront's Contact page. For this to show real data, the Contact form needs to
  POST to a backend endpoint (e.g. `/api/contacts`) that stores submissions somewhere
  the admin page can read from.

If authentication is now partially wired up, double-check:
1. Is there a real backend check behind `CustomerLogin` / `AdminLogin`, or are they
   still placeholder forms like the original scaffold?
2. Does `ProtectedRoute` actually redirect unauthenticated users, and is it applied to
   every route that should be locked down?
3. Is there a `Customer`/`Admin` model + hashed password + token flow on the backend
   backing these pages, or just the frontend forms so far?

## Requirements

- Node.js 18+ and npm

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API starts on **http://localhost:5000**. By default it runs entirely on an
in-memory data store (`backend/data/store.js`), pre-loaded with sample products, so
there is nothing else to configure to get going.

Health check: http://localhost:5000/api/health

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The site starts on **http://localhost:5173** and talks to the API at
`http://localhost:5000/api` (see `frontend/src/services/api.js`). To point it at a
different API URL, create `frontend/.env` with:

```
VITE_API_URL=http://localhost:5000/api
```

## Using the site

- **Storefront**: `/`, `/about-us`, `/products/sweets`, `/products/snacks`,
  `/products/chats`, `/product/:id`, `/cart`, `/checkout`, `/contact-us`
- **Customer account**: `/login`, `/register`, `/account` *(exact route paths depend
  on how they were added to `App.jsx` — check there if these don't match)*
- **Admin dashboard**: `/admin` (Dashboard), `/admin/products`, `/admin/products/new`,
  `/admin/products/:id/edit`, `/admin/orders`, `/admin/orders/:id`, `/admin/contacts`

## Connecting a real database (MongoDB)

The Mongoose models already exist in `backend/models/` (`Product.js`, `Order.js`,
`Customer.js`, `Admin.js`). To switch over:

1. Install and run MongoDB locally, or use MongoDB Atlas.
2. In `backend/.env`, set:
   ```
   USE_DB=true
   MONGODB_URI=mongodb://127.0.0.1:27017/sri_enippagam
   ```
3. In `backend/controllers/productController.js` and `orderController.js`, replace
   the `store.*` calls with the equivalent Mongoose model calls (e.g.
   `Product.find()`, `Product.findById(id)`, `Product.create(data)`, etc.). The
   request/response shape of each route stays the same, so the frontend needs no
   changes.

Nothing else in the app depends on the in-memory store directly, so this swap is
contained to those two files. If contacts and customer accounts were added on the
frontend only, they'll need matching models/routes/controllers on the backend
following the same pattern before they can persist real data.

## Next steps you can build on top of this

- **Finish authentication**: back `CustomerLogin`, `CustomerRegister`, `AdminLogin`,
  and `ProtectedRoute` with real backend checks — hash passwords, issue a session or
  JWT, and verify it in `backend/middleware/auth.js` (`protectAdmin` /
  `protectCustomer`).
- **Contacts backend**: add a `Contact` model/route/controller so `ContactsList` reads
  real submissions instead of empty or mock data.
- **Payments**: hook a payment provider into the checkout flow in
  `frontend/src/pages/Checkout.jsx` and `backend/controllers/orderController.js`.
- **Notifications**: send order confirmation emails/SMS from `createOrder` in
  `backend/controllers/orderController.js`.
- **Real product images**: swap the `https://placehold.co/...` placeholder URLs in
  `backend/data/seedProducts.js` (and any product added via the admin dashboard) for
  your own hosted images, or copy the original site's `assets/` folder into
  `frontend/public/assets` and reference those paths instead.
- **Original CSS/assets**: the original site's `assets/css` and `assets/img` files
  weren't included in the source HTML you provided, so `frontend/src/styles/main.css`
  recreates the same layout and sections (topbar, header/nav with dropdown, hero, "why
  choose us", product grids, testimonials, footer, contact form + maps) with a fresh
  stylesheet rather than a pixel-exact copy. Drop the real assets into
  `frontend/public/assets` and adjust the CSS/image paths for an exact match.

## Notes on the sample data

`backend/data/seedProducts.js` contains a handful of sample sweets/snacks/chats
products so the storefront isn't empty on first run. Add, edit, or delete products
from the Admin dashboard — since the store is in-memory, this data resets whenever
the backend server restarts (until you connect MongoDB).
