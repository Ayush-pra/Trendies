<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
</p>

<div align="center">

# 🛍️ Trendies

### Modern Full-Stack E-Commerce Platform

A production-ready MERN stack fashion e-commerce application featuring AI-powered shopping assistance, secure JWT authentication, Razorpay payments, and a dedicated admin dashboard.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Trendies-orange?style=for-the-badge)](https://trendies-frontend-b7wv.onrender.com)
[![Admin Panel](https://img.shields.io/badge/🔒_Admin_Panel-Dashboard-blue?style=for-the-badge)](https://trendies-admin-o01i.onrender.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Future Roadmap](#-future-roadmap)
- [Author](#-author)

---

## 🔍 Overview

**Trendies** is a full-stack e-commerce platform built for modern fashion retail. It delivers a premium shopping experience for end-users while providing store administrators with a powerful management dashboard.

The platform is designed with a **separation of concerns** architecture — the storefront, admin panel, and API server are independently deployable, allowing each layer to scale on its own.

### What Sets Trendies Apart

- **AI Shopping Assistant** — An intelligent chatbot powered by OpenRouter (DeepSeek) that understands shopping intent, recommends products from the real catalog, and provides fashion advice.
- **Secure Session Management** — HTTP-only JWT cookies as the single source of truth. No localStorage auth hacks.
- **Real-Time Order Lifecycle** — Orders progress through 5 trackable stages, synced between the user dashboard and admin panel.
- **Dual Payment Support** — Razorpay (UPI, Cards, Wallets) and Cash on Delivery with explicit user selection.
- **Wishlist System** — Dedicated wishlist schema and collection, enabling authenticated users to toggle products, view saved items, and track totals with a navbar heart badge.
- **Price Range Filtering** — Multi-range sidebar controls dynamically coupled with category/subcategory tags and active chip selectors.
- **Stateless Pagination** — Dynamic layout loading that paginates matching results into pages of 12 when search/filter attributes are applied.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                │
│                                                                 │
│   ┌──────────────────┐              ┌──────────────────┐        │
│   │  User Storefront │              │   Admin Panel    │        │
│   │   (React + Vite) │              │  (React + Vite)  │        │
│   │   Port: 5173     │              │   Port: 5174     │        │
│   └────────┬─────────┘              └────────┬─────────┘        │
│            │                                  │                  │
└────────────┼──────────────────────────────────┼──────────────────┘
             │         HTTP-Only Cookies        │
             │         withCredentials          │
             ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API SERVER                         │
│                     (Express.js — Port 3000)                    │
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│   │   Auth   │  │ Products │  │  Orders  │  │  AI Chatbot  │   │
│   │  Routes  │  │  Routes  │  │  Routes  │  │   Routes     │   │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│        │             │             │                │            │
│   ┌────┴─────────────┴─────────────┴────────────────┴───────┐   │
│   │              Controllers + Middleware                    │   │
│   │    (JWT Auth · Admin Auth · Optional Auth · Multer)      │   │
│   └────┬─────────────┬─────────────┬────────────────┬───────┘   │
│        │             │             │                │            │
│        ▼             ▼             ▼                ▼            │
│   ┌─────────┐  ┌──────────┐  ┌──────────┐   ┌────────────┐     │
│   │ MongoDB │  │Cloudinary│  │ Razorpay │   │ OpenRouter │     │
│   │  Atlas  │  │  (Media) │  │(Payments)│   │    (AI)    │     │
│   └─────────┘  └──────────┘  └──────────┘   └────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🛒 User Storefront

| Feature | Description |
|---|---|
| **Authentication** | Email/password registration & login with JWT. Google OAuth via Firebase. |
| **Product Catalog** | Browse products with multi-level filtering by Category (Men, Women, Kids) and SubCategory (TopWear, BottomWear, WinterWear). |
| **Smart Search** | Real-time product search with instant filtering. |
| **Product Details** | Full product view with image gallery, size selector, quantity picker, and related product recommendations. |
| **Shopping Cart** | Persistent server-side cart that syncs automatically on login/logout. Size-aware inventory tracking. |
| **Checkout** | Delivery form with dual payment: Razorpay (Cards, UPI, Wallets) or Cash on Delivery. Explicit payment method selection required. |
| **Order Tracking** | Real-time order status: `Order Placed → Packing → Shipped → Out for Delivery → Delivered`. |
| **AI Chatbot** | Intelligent fashion assistant that can search products, provide recommendations, answer store queries, and give fashion advice — all grounded in real catalog data. |
| **Splash Screen** | Animated brand intro on first visit. |

### 🔧 Admin Dashboard

| Feature | Description |
|---|---|
| **Secure Login** | Environment-variable-based admin credentials with separate JWT flow. |
| **Product Management** | Add new products with up to 4 images (Cloudinary upload), set categories, sizes, pricing, and bestseller flags. View and delete existing products. |
| **Order Management** | View all orders across users. Update order status in real-time (syncs with user view). |
| **Revenue Overview** | Dashboard displaying total products, orders, and revenue. |

---

## 🧰 Tech Stack

### Frontend (Storefront + Admin)

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| React Router DOM 7 | Client-side routing |
| Axios | HTTP client with cookie credentials |
| Firebase | Google OAuth authentication |
| Framer Motion | Animations & transitions |
| React Toastify | Toast notifications |
| React Icons | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express 5 | Web framework & REST API |
| MongoDB + Mongoose 8 | Database & ODM |
| JWT + bcryptjs | Authentication & password hashing |
| Razorpay SDK | Payment gateway integration |
| Cloudinary | Image upload & CDN |
| OpenAI SDK (OpenRouter) | AI chatbot (DeepSeek model) |
| Multer | Multipart file upload handling |
| Cookie Parser | HTTP-only cookie management |
| Validator | Input validation |

---

## 📸 Screenshots

<img width="1877" height="857" alt="Trendies Homepage" src="https://github.com/user-attachments/assets/89ede8fa-cb17-4feb-a86d-6ccec73a420d" />
<img width="1871" height="854" alt="Product Collection" src="https://github.com/user-attachments/assets/30094bf3-28a0-47e5-b3bf-4a3400ef7c17" />
<img width="1898" height="844" alt="Product Detail" src="https://github.com/user-attachments/assets/cf82e14d-fc5a-4910-94a2-4748ffbf55ff" />

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** Atlas cluster (or local instance)
- **Cloudinary** account (for image uploads)
- **Razorpay** account (for payment processing)
- **Firebase** project (for Google OAuth)
- **OpenRouter** API key (for AI chatbot — optional)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ayush-pra/Trendies.git
cd Trendies

# 2. Install & run the Backend
cd backend
npm install
npm run dev          # starts with nodemon on port 3000

# 3. Install & run the User Frontend (new terminal)
cd frontend
npm install
npm run dev          # starts on port 5173

# 4. Install & run the Admin Panel (new terminal)
cd Admin
npm install
npm run dev          # starts on port 5174
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret

# Admin Credentials
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Chatbot (Optional)
OPENROUTER_API_KEY=your_openrouter_api_key
```

### User Frontend (`frontend/.env`)

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 📡 API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/register` | Register new user | Public |
| `POST` | `/login` | User login | Public |
| `GET` | `/logout` | Clear session cookie | Public |
| `POST` | `/googlelogin` | Google OAuth login | Public |
| `POST` | `/adminlogin` | Admin login | Public |

### Users — `/api/user`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/getCurrentUser` | Get authenticated user profile | 🔒 User |
| `GET` | `/getCurrentAdmin` | Get admin session | 🔒 Admin |

### Products — `/api/product`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/list` | List all products | Public |
| `GET` | `/single/:id` | Get single product | Public |
| `POST` | `/add` | Add new product (with images) | 🔒 Admin |
| `POST` | `/remove` | Delete a product | 🔒 Admin |

### Wishlist — `/api/wishlist`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/toggle` | Toggle item in wishlist (adds/removes) | 🔒 User |
| `GET` | `/` | Fetch all user's wishlisted product IDs | 🔒 User |

### Cart — `/api/cart`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/get` | Get user's cart | 🔒 User |
| `POST` | `/add` | Add item to cart | 🔒 User |
| `POST` | `/update` | Update item quantity | 🔒 User |

### Orders — `/api/order`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/placeorder` | Place COD order | 🔒 User |
| `POST` | `/razorpay` | Create Razorpay order | 🔒 User |
| `POST` | `/verifyRazorpay` | Verify Razorpay payment | 🔒 User |
| `POST` | `/userorders` | Get user's orders | 🔒 User |
| `GET` | `/allorders` | Get all orders | 🔒 Admin |
| `POST` | `/status` | Update order status | 🔒 Admin |

### AI Chatbot — `/api/chat`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/message` | Send message to AI assistant | Optional |

---

## 📁 Project Structure

```
Trendies/
│
├── frontend/                    # User-facing storefront
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx       #   Navigation with profile dropdown & wishlist icon
│   │   │   ├── Card.jsx         #   Card component with wishlist heart icon and hover effects
│   │   │   ├── Pagination.jsx   #   Reusable stateless pagination component
│   │   │   ├── Chatbot.jsx      #   AI fashion assistant widget
│   │   │   ├── SplashScreen.jsx #   Animated brand intro
│   │   │   ├── CartTotal.jsx    #   Cart summary component
│   │   │   ├── BestSeller.jsx   #   Featured products carousel
│   │   │   └── ...
│   │   ├── pages/               # Route-level pages
│   │   │   ├── Collection.jsx   #   Product catalog with pagination
│   │   │   ├── Wishlist.jsx     #   Dedicated wishlist items management page
│   │   │   ├── ProductDetail.jsx#   Single product view
│   │   │   ├── Cart.jsx         #   Shopping cart
│   │   │   ├── PlaceOrder.jsx   #   Checkout with payment selection
│   │   │   ├── Order.jsx        #   Order history & tracking
│   │   │   ├── Login.jsx        #   User login (Email + Google)
│   │   │   ├── Registration.jsx #   User registration
│   │   │   └── VirtualTryOn.jsx #   AI virtual try-on (experimental)
│   │   ├── context/             # React Context providers
│   │   │   ├── AuthContext.jsx  #   Server URL configuration
│   │   │   ├── UserContext.jsx  #   Auth state + session management
│   │   │   ├── ShopContext.jsx  #   Products, cart, search state
│   │   │   └── WishlistContext.jsx # Global wishlist Set state management
│   │   └── index.css            # Global styles & Tailwind config
│   └── package.json
│
├── Admin/                       # Admin dashboard (separate app)
│   ├── src/pages/
│   │   ├── Home.jsx             #   Dashboard overview
│   │   ├── Add.jsx              #   Add new products
│   │   ├── List.jsx             #   View/delete products
│   │   ├── Orders.jsx           #   Manage order statuses
│   │   └── Login.jsx            #   Admin authentication
│   ├── context/
│   │   ├── AuthContext.jsx      #   Server URL configuration
│   │   └── AdminContext.jsx     #   Admin session state
│   └── package.json
│
├── backend/                     # Express.js API server
│   ├── config/
│   │   ├── db.js                #   MongoDB connection
│   │   ├── cloudinary.js        #   Cloudinary configuration
│   │   └── token.js             #   JWT token generation
│   ├── middleware/
│   │   ├── authMiddleware.js    #   User JWT verification
│   │   ├── adminAuth.js         #   Admin JWT verification
│   │   └── optionalAuth.js      #   Optional auth (for chatbot)
│   ├── model/
│   │   ├── userModel.js         #   User schema
│   │   ├── productModel.js      #   Product schema
│   │   ├── orderModel.js        #   Order schema
│   │   └── wishlistModel.js     #   Wishlist schema with compound unique constraints
│   ├── controller/
│   │   ├── authController.js    #   Login, register, logout, OAuth
│   │   ├── wishlistController.js#   Toggle and get wishlist items
│   │   ├── productController.js #   CRUD product operations
│   │   ├── cartController.js    #   Cart operations
│   │   ├── orderController.js   #   Order lifecycle + Razorpay
│   │   ├── chatController.js    #   AI chatbot orchestrator
│   │   └── userController.js    #   User profile retrieval
│   ├── services/                #   AI chatbot service layer
│   │   ├── aiService.js         #   OpenRouter AI integration
│   │   ├── chatService.js       #   Intent routing orchestrator
│   │   ├── productSearchService.js  # MongoDB product search
│   │   ├── productInfoService.js    # Product detail lookup
│   │   ├── orderQueryService.js     # Order status lookup
│   │   └── storeInfoService.js      # Store FAQ responses
│   ├── routes/                  #   Express route definitions
│   │   ├── wishlistRoute.js     #   Toggle and get wishlist API routes
│   │   └── ...
│   ├── app.js                   #   Server entry point
│   └── package.json
│
└── README.md
```

---

## 🔒 Security

| Measure | Implementation |
|---|---|
| **Password Hashing** | bcryptjs with 10 salt rounds |
| **JWT Tokens** | HTTP-only cookies with `Secure` and `SameSite` flags in production |
| **Session Validation** | Backend-verified authentication on every protected request. No localStorage-based auth. |
| **Auth Guards** | Frontend route protection via `UserContext` with `authLoading` state to prevent race conditions |
| **CORS** | Whitelisted origins with `credentials: true` |
| **Admin Isolation** | Separate JWT flow with environment-variable-based credentials |
| **Input Validation** | Server-side email and password validation via `validator` library |
| **Database Constraints** | Compound unique indexes preventing duplicate items in collections (e.g. Wishlist) |

---

## 🗺️ Future Roadmap

- [ ] AI-powered Virtual Try-On for clothing
- [ ] AI-driven size recommendations based on user preferences
- [ ] Product reviews & ratings
- [ ] Admin analytics dashboard with charts
- [ ] Email notifications for order status changes
- [ ] Inventory management with stock tracking

---

## 👨‍💻 Author

**Ayush Prajapati**

Computer Science Engineer · Full-Stack MERN Developer

> Passionate about building scalable full-stack applications and integrating AI into real-world products.

---

<div align="center">

⭐ If you found this project useful, please consider giving it a star!

</div>
