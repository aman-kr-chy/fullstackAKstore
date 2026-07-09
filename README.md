# AKstore - Full-Stack E-Commerce Platform 🛒

![AKstore](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop)

AKstore is a modern, responsive, and fully-featured E-Commerce platform built from the ground up using the MERN stack (MongoDB, Express, React, Node.js). It offers a seamless shopping experience with comprehensive product filtering, a dynamic shopping cart, a secure checkout process, and a beautifully designed user interface optimized for all devices.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Responsive Design:** Perfect viewing experience across desktops, tablets, and smartphones (iPhones/Androids).
- **Dynamic Product Browsing:** View products by categories (Mobiles, Fashion, Electronics, Beauty, Toys).
- **Smart Search & Filtering:** Instantly search for products or filter results by price range and ratings.
- **Robust Shopping Cart:** Add items, adjust quantities, and remove items with real-time price calculation (including taxes and shipping).
- **Secure Checkout Flow:** Step-by-step checkout process including Shipping Address, Payment Method, and Order Review.
- **User Profiles:** Customers can manage their profiles, view order history, and track delivery statuses.

### ⚙️ Technical Highlights
- **State Management:** Utilizes Redux Toolkit for efficient global state management (cart, authentication, user profiles).
- **Modern UI Components:** Built with Tailwind CSS and Framer Motion for sleek layouts and smooth micro-animations.
- **RESTful API:** A robust Node.js/Express backend handling users, products, categories, and orders.
- **Secure Authentication:** JWT (JSON Web Tokens) securely stored in HTTP-only cookies to protect user sessions.
- **Database:** MongoDB configured with Mongoose for flexible and scalable data storage.

---

## 🛠️ Technology Stack

| Frontend                | Backend                | Tools & Deployment       |
| ----------------------- | ---------------------- | ------------------------ |
| React (Vite)            | Node.js                | Git & GitHub             |
| Tailwind CSS            | Express.js             | Prettier & ESLint        |
| Redux Toolkit           | MongoDB (Mongoose)     | Vite Proxy (Dev)         |
| Framer Motion           | JSON Web Tokens (JWT)  | Environment Variables    |
| React Router v7         | bcryptjs               |                          |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local installation or MongoDB Atlas cluster)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/aman-kr-chy/fullstackAKstore.git
cd fullstackAKstore
```

**2. Setup the Backend**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory (use `.env.example` as a template):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```
Run the backend server:
```bash
npm run dev
```

**3. Setup the Frontend**
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory (use `.env.example` as a template):
```env
VITE_API_URL=http://localhost:5000/api
```
Run the frontend development server:
```bash
npm run dev
```

The application will now be running on `http://localhost:5173`.

---

## 📦 Production Deployment

AKstore is pre-configured for easy deployment.

1. **Frontend:** Can be deployed instantly on [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Ensure you set the `VITE_API_URL` environment variable to point to your live backend.
2. **Backend:** Can be deployed on services like [Render](https://render.com) or [Railway](https://railway.app). Make sure to configure the `FRONTEND_URL` environment variable to match your live Vercel/Netlify domain to prevent CORS errors.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/aman-kr-chy/fullstackAKstore/issues).

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
