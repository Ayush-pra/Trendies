# 🛍️ Trendies — MERN E-Commerce Platform

**Trendies** is a full-stack MERN e-commerce application designed for modern fashion shopping.  
It provides a seamless shopping experience for users and a powerful admin dashboard for managing products and orders efficiently.

---

## 🌐 Live Demo
🔗 **Frontend (User):** https://trendies-frontend-b7wv.onrender.com   
🔗 **Admin Panel:** https://trendies-admin-o01i.onrender.com  

> *(Best viewed on desktop for full admin features)*

---

## ✨ Key Features

### 👤 User Features
- User authentication (Sign In / Sign Up)
- Google OAuth authentication
- Product search & advanced filtering
- Detailed product view
- Related products suggestions
- Add to cart & checkout
- Secure payments:
  - Cash on Delivery (COD)
  - Razorpay Payment Gateway
- Order tracking with live status updates:
  - Order Placed
  - Packing
  - Shipped
  - Out for Delivery
  - Delivered

---

### 🛠️ Admin Panel Features
- Secure admin authentication
- Add & manage products
- View all listed products
- Order management dashboard
- Update order status (real-time sync with user view)
- Payment & delivery tracking

---

## 🧰 Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

### Authentication
- JWT
- Google OAuth

### Payments
- Razorpay

---

## 📁 Project Structure
trendies/
│
├── frontend/ # User-facing UI (React)
├── Admin/ # Admin dashboard (React)
├── backend/ # Server-side API (Node + Express)


---

## ⚙️ Installation & Local Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Ayush-pra/Trendies.git
cd Trendies

2️⃣ Run User Frontend
cd frontend
npm install
npm run dev

3️⃣ Run Admin Panel
cd Admin
npm install
npm run dev

4️⃣ Run Backend Server
cd backend
npm install
nodemon ./app.js

🔐 Environment Variables needed for User frontend
VITE_FIREBASE_API_KEY = your_firebase_api_key
VITE_RAZORPAY_KEY_ID = your_razorpay_key_id

🔐 Environment Variables needed for backend
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

📸 Screenshots :
<img width="1877" height="857" alt="image" src="https://github.com/user-attachments/assets/89ede8fa-cb17-4feb-a86d-6ccec73a420d" />
<img width="1871" height="854" alt="image" src="https://github.com/user-attachments/assets/30094bf3-28a0-47e5-b3bf-4a3400ef7c17" />
<img width="1898" height="844" alt="image" src="https://github.com/user-attachments/assets/cf82e14d-fc5a-4910-94a2-4748ffbf55ff" />

🚀 Future Enhancements
AI-powered Virtual Try-On for clothing
AI model for:
Accurate size recommendations
Personalized color suggestions
Wishlist functionality
Product reviews & ratings
Admin analytics dashboard

👨‍💻 Author
Ayush Prajapati
Computer Science Engineer | MERN Stack Developer

📌 Passionate about building scalable full-stack applications and integrating AI into real-world products.
