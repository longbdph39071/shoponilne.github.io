import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Statistics from './pages/Statistics';
import Users from './pages/Users';
import Test from './pages/Test';
import Simple from './pages/Simple';
import Shopping from './pages/Shopping';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import OrderApproval from './pages/OrderApproval';
import './App.css';

// Component bảo vệ route
const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return <Loading text="Đang kiểm tra quyền truy cập..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1 style={{ marginBottom: 16 }}>⚠️ Không có quyền truy cập</h1>
        <p>Bạn không có quyền truy cập trang này.</p>
        <button 
          onClick={() => window.history.back()}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Quay lại
        </button>
      </div>
    );
  }

  return children;
};

// Component chính
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading text="Đang khởi tạo ứng dụng..." />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simple" element={<Simple />} />
        <Route path="/test" element={<Test />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/order-history" element={<OrderHistory />} />
        
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <Login />
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/products" element={
          <ProtectedRoute requiredPermission="view_products">
            <Layout>
              <Products />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/customers" element={
          <ProtectedRoute requiredPermission="view_customers">
            <Layout>
              <Customers />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute requiredPermission="view_orders">
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/order-approval" element={
          <ProtectedRoute requiredPermission="edit_orders">
            <Layout>
              <OrderApproval />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/statistics" element={
          <ProtectedRoute>
            <Layout>
              <Statistics />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute requiredPermission="view_users">
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider locale={viVN}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
