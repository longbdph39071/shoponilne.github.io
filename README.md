# 🛍️ Shop Online - React E-commerce Application

A modern e-commerce web application built with React, Ant Design, and JSON Server.

## 🌟 Features

### 👤 User Features
- **User Authentication**: Register, Login, Logout
- **Product Browsing**: View products with search and filtering
- **Shopping Cart**: Add/remove items, quantity management
- **Order Management**: Place orders, view order history
- **Profile Management**: Update personal information, change password

### 🛒 Shopping Features
- **Product Catalog**: Browse products by category
- **Search & Filter**: Find products easily
- **Cart System**: Manage shopping cart
- **Checkout Process**: Complete order placement
- **Order Tracking**: Real-time order status updates

### 👨‍💼 Admin Features
- **Dashboard**: Overview of sales, orders, customers
- **Product Management**: CRUD operations for products
- **Order Management**: View and update order status
- **Customer Management**: View customer information
- **Order Approval**: Approve/reject pending orders

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/longbdph39071/shoponilne.github.io.git
   cd shoponilne.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm run server
   # or
   npx json-server --watch db.json --port 3000 --middlewares ./node_modules/json-server-auth
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout component
│   ├── Navigation.jsx  # Navigation bar
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx        # Home page
│   ├── Shopping.jsx    # Shopping page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Profile.jsx     # User profile page
│   ├── OrderHistory.jsx # Order history page
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── services/           # API services
│   └── api.js         # API configuration
└── utils/              # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON server backend
- `npm run deploy` - Build and deploy to GitHub Pages
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Users
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /users` - Get all users (admin only)
- `PATCH /users/:id` - Update user profile

### Orders
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `PATCH /orders/:id` - Update order status

## 👥 Default Users

### Admin Account
- **Email**: admin@company.com
- **Password**: admin123
- **Role**: admin

### Staff Account
- **Email**: staff@company.com
- **Password**: staff123
- **Role**: staff

### Customer Account
- **Email**: bdlbnana06@gmail.com
- **Password**: customer123
- **Role**: customer

## 🎨 Technologies Used

- **Frontend**: React 18, Vite
- **UI Library**: Ant Design
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Backend**: JSON Server with Auth
- **Charts**: Recharts
- **Icons**: Ant Design Icons

## 🚀 Deployment

### GitHub Pages
The application is automatically deployed to GitHub Pages when you push to the main branch.

**Live Demo**: https://longbdph39071.github.io/shoponilne.github.io/

### Manual Deployment
```bash
npm run build
npm run deploy
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Shop Online
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ by Long Bùi**
