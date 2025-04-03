import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import UserDashboardHome from './pages/UserDashboard/UserDashboardHome';
import AddDoctor from './pages/UserDashboard/AddDoctor';
import SalesActivity from './pages/UserDashboard/SalesActivity';
import DoctorVisiting from './pages/UserDashboard/DoctorVisiting';
import Orders from './pages/UserDashboard/Orders';
import Expences from './pages/UserDashboard/Expences';
import PdfAndFiles from './pages/UserDashboard/PdfAndFiles';
import ProductList from './pages/UserDashboard/Product';
import Login from './pages/Auth/Login';

import DashboardHome from './pages/AdminDashboard/DashboardHome';
import UserTracker from './pages/AdminDashboard/UserTracker';
import CreateUser from './pages/AdminDashboard/CreateUser';
import AdminDashboard from './components/AdminDashboard';
import MrDashboard from './components/MrDashboard';
import Report from './pages/UserDashboard/Report';
import AllUser from './pages/AdminDashboard/AllUser';
import SingleUser from './pages/AdminDashboard/SingleUser';
import AddPdf from './pages/AdminDashboard/AddPdf';
import AdminAddDoctor from './pages/AdminDashboard/AdminAddDoctor';
import AllPdf from './pages/AdminDashboard/AllPdf';
import AddHeadOffice from './pages/AdminDashboard/AddHeadOffice';
import AdminSalesActivity from './pages/AdminDashboard/AdminSalesActivity';
import DoctorVisiteAdmin from './pages/AdminDashboard/DoctorVisiteAdmin';
import DoctorVisiteAdminById from './pages/AdminDashboard/DoctorVisiteAdminById';
import ExpencesAdmin from './pages/AdminDashboard/ExpencesAdmin';
import ExpencesAdminById from './pages/AdminDashboard/ExpencesAdminById';
import AdminOrdersByUser from './pages/AdminDashboard/AdminOrdersByUser';
import AdminOrders from './pages/AdminDashboard/AdminOrders';
import Broucher from './pages/UserDashboard/Broucher';
import DailyPost from './pages/UserDashboard/DailyPost';
import PromotionImg from './pages/UserDashboard/PromotionImg';

// Protected Route Component
const ProtectedRoute = ({ role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'Admin' ? "/admin-dashboard" : "/mr-dashboard"} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Router basename="/mr">
      <Routes>
        {/* LOGIN ROUTE */}
        <Route path="/" element={<Login />} />

        {/* Admin Dashboard (Protected) */}
        <Route element={<ProtectedRoute role="Admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="all-user" element={<AllUser />} />
            <Route path="add-doctor" element={<AdminAddDoctor />} />
            <Route path="all-user/:id" element={<SingleUser />} />
            <Route path="user-tracker" element={<UserTracker />} />
            <Route path="add-pdf" element={<AddPdf />} />
            <Route path="all-pdf" element={<AllPdf />} />
            <Route path="head-office" element={<AddHeadOffice />} />
            <Route path="sales" element={<AdminSalesActivity />} />
            <Route path="doctor-visiting" element={<DoctorVisiteAdmin />} />
            <Route path="admin/visits/:userId" element={<DoctorVisiteAdminById />} />
            <Route path="admin-expenses" element={<ExpencesAdmin />} />
            <Route path="admin-expences/:expenseId" element={<ExpencesAdminById />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:userId" element={<AdminOrdersByUser />} />
          </Route>
        </Route>

        {/* MR Dashboard (Protected for Logged-in Users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mr-dashboard" element={<MrDashboard />}>
            <Route index element={<UserDashboardHome />} />
            <Route path="pdf-files" element={<PdfAndFiles />} />
            <Route path="add-doctor" element={<AddDoctor />} />
            <Route path="sales-activity" element={<SalesActivity />} />
            <Route path="doctor-visiting" element={<DoctorVisiting />} />
            <Route path="add-products" element={<ProductList />} />
            <Route path="order" element={<Orders />} />
            <Route path="expences" element={<Expences />} />
            <Route path="reports" element={<Report />} />
            <Route path="brochers-img" element={<Broucher />} />
            <Route path="daily-img" element={<DailyPost />} />
            <Route path="promotional-img" element={<PromotionImg />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
