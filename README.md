# Sri Enippagam — React E-commerce Site

A React conversion of the original Sri Enippagam HTML site, extended into a working
storefront (browse products, cart, checkout) with an admin dashboard (manage products
and orders). Ships with a Node/Express API that runs out of the box on an in-memory
data store, and is structured so you can drop in MongoDB whenever you're ready.

## Project structure

```
sri-enippagam/
├── frontend/          React app (Vite)
│   └── src/
│       ├── components/
│       │   ├── layout/      TopBar, Navbar, Footer, Layout
│       │   ├── product/     ProductCard, ProductGrid
│       │   ├── cart/        CartItem
│       │   ├── common/      Loader, SubBanner, SectionTitle
│       │   └── admin/       AdminSidebar, AdminLayout
│       ├── pages/           Home, About, ProductCategory, ProductDetails,
│       │                    Cart, Checkout, OrderSuccess, Contact, NotFound
│       ├── pages/admin/     AdminLogin, Dashboard, ProductsList, ProductForm,
│       │                    OrdersList, OrderDetails
│       ├── context/         CartContext (cart state + localStorage)
│       ├── services/        api.js (all backend calls)
│       └── styles/          main.css, admin.css
│
└── backend/           Express API
    ├── models/         Mongoose schemas (Product, Order, Customer, Admin) — ready
    │                   for MongoDB, not required to run the app today
    ├── data/           store.js (in-memory data used by default) + seedProducts.js
    ├── controllers/    productController.js, orderController.js, authController.js
    ├── routes/         productRoutes.js, orderRoutes.js, authRoutes.js
    ├── middleware/      auth.js (stub), errorHandler.js
    └── config/db.js    MongoDB connection helper
```

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
- **Admin dashboard**: `/admin` (Dashboard), `/admin/products`, `/admin/products/new`,
  `/admin/products/:id/edit`, `/admin/orders`, `/admin/orders/:id`

There is no login enforced yet — `/admin/login` is a placeholder screen you can wire
up once real authentication is added (see "Next steps" below).

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
   `Product.find()`, `Product.findById(id)`, `Product.create(data)`, etc.) The
   request/response shape of each route stays the same, so the frontend needs no
   changes.

Nothing else in the app depends on the in-memory store directly, so this swap is
contained to those two files.

## Next steps you can build on top of this

- **Authentication**: `backend/middleware/auth.js` and `backend/routes/authRoutes.js`
  are stubbed out for both admin and customer logins (JWT or session based). Once
  added, protect the admin routes on both the API (`protectAdmin` middleware) and the
  frontend (a route guard around `AdminLayout`).
- **Payments**: hook a payment provider into the checkout flow in
  `frontend/src/pages/Checkout.jsx` and `backend/controllers/orderController.js`.
- **Notifications**: send order confirmation emails/SMS from
  `createOrder` in `backend/controllers/orderController.js`.
- **Real product images**: swap the `https://placehold.co/...` placeholder URLs in
  `backend/data/seedProducts.js` (and any product you add via the admin dashboard)
  for your own hosted images, or copy the original site's `assets/` folder into
  `frontend/public/assets` and reference those paths instead.
- **Original CSS/assets**: the original site's `assets/css` and `assets/img` files
  weren't included in the source you provided, so `frontend/src/styles/main.css` is a
  fresh stylesheet recreating the same layout, sections and structure (topbar,
  header/nav with dropdown, hero, "why choose us", product grids, testimonials,
  footer, contact form + maps). Drop the real assets into `frontend/public/assets` and
  adjust the CSS/image paths if you want a pixel-exact match to the original design.

## Notes on the sample data

`backend/data/seedProducts.js` contains a handful of sample sweets/snacks/chats
products so the storefront isn't empty on first run. Add, edit, or delete products
from the Admin dashboard — since the store is in-memory, this data resets whenever
the backend server restarts (until you connect MongoDB).
