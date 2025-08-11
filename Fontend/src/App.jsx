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
import RoleDashboard from './components/RoleDashboard';
import SuperAdminHome from './pages/SuperAdminDashboard/SuperAdminHome';
import OppsTeamHome from './pages/OppsTeamDashboard/OppsTeamHome';
import NationalHeadHome from './pages/NationalHeadDashboard/NationalHeadHome';
import StateHeadHome from './pages/StateHeadDashboard/StateHeadHome';
import ZonalManagerHome from './pages/ZonalManagerDashboard/ZonalManagerHome';
import AreaManagerHome from './pages/AreaManagerDashboard/AreaManagerHome';
import ManagerHome from './pages/ManagerDashboard/ManagerHome';
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
import AddProduct from './pages/AdminDashboard/AddProduct';
import DoctorDetail from './pages/AdminDashboard/DoctorDetail';
import AdminAddStockist from './pages/AdminDashboard/AdminAddStockist';
import AdminAddChemist from './pages/AdminDashboard/AdminAddChemist';
import StockistDetail from './pages/AdminDashboard/StockistDetail';
import ChemistDetail from './pages/AdminDashboard/ChemistDetail';
import ManageStates from './pages/AdminDashboard/ManageStates';
import ManagerList from './pages/AdminDashboard/ManagerList';
import AreaManagerList from './pages/AdminDashboard/AreaManagerList';
import ZonalManagerList from './pages/AdminDashboard/ZonalManagerList';

import SingleProduct from './pages/UserDashboard/SingleProduct';
import AddChemis from './pages/UserDashboard/AddChemis';
import ChemistVisiting from './pages/UserDashboard/ChemistVisiting';
import AddStockist from './pages/UserDashboard/AddStockist';
import StockistVisite from './pages/UserDashboard/StockistVisite';
import RaiseTicket from './pages/UserDashboard/RaiseTicket';

import ChemistVistingAdmin from './pages/AdminDashboard/ChemistVistingAdmin';
import ChemistVisitingAdminById from './pages/AdminDashboard/ChemistVisitingAdminById';
import StockistVisitingAdmin from './pages/AdminDashboard/StockistVisitingAdmin';
import StockistVisitingAdminById from './pages/AdminDashboard/StockistVisitingAdminById';
import SendNotification from './pages/AdminDashboard/SendNotification';
import GetNotification from './pages/UserDashboard/GetNotification';
import GetRaisedTicket from './pages/AdminDashboard/GetRaisedTicket';



// Protected Route Component
const ProtectedRoute = ({ role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    const roleRoutes = {
      'Super Admin': '/super-admin-dashboard',
      'Admin': '/admin-dashboard',
      'Opps Team': '/opps-team-dashboard',
      'National Head': '/national-head-dashboard',
      'State Head': '/state-head-dashboard',
      'Zonal Manager': '/zonal-manager-dashboard',
      'Area Manager': '/area-manager-dashboard',
      'Manager': '/manager-dashboard',
      'User': '/mr-dashboard'
    };
    return <Navigate to={roleRoutes[user.role] || "/mr-dashboard"} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Router basename="/mr-login">
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
            <Route path="doctor-detail/:id" element={<DoctorDetail />} />
            <Route path="add-stockist" element={<AdminAddStockist />} />
            <Route path="stockist-detail/:id" element={<StockistDetail />} />
            <Route path="add-chemist" element={<AdminAddChemist />} />
            <Route path="chemist-detail/:id" element={<ChemistDetail />} />
            <Route path="all-user/:id" element={<SingleUser />} />
            <Route path="user-tracker" element={<UserTracker />} />
            <Route path="add-pdf" element={<AddPdf />} />
            <Route path="all-pdf" element={<AllPdf />} />
            <Route path="manage-states" element={<ManageStates />} />
            <Route path="head-office" element={<AddHeadOffice />} />
            <Route path="sales" element={<AdminSalesActivity />} />


            <Route path="chemist-visiting" element={<ChemistVistingAdmin />} />
            <Route path="chemist-visits/:userId" element={<ChemistVisitingAdminById />} />
            <Route path="stockist-visiting" element={<StockistVisitingAdmin />} />
            <Route path="stockist-visits/:userId" element={<StockistVisitingAdminById />} />


            <Route path="doctor-visiting" element={<DoctorVisiteAdmin />} />
            <Route path="admin/visits/:userId" element={<DoctorVisiteAdminById />} />
            <Route path="admin-expenses" element={<ExpencesAdmin />} />
            <Route path="admin-expences/:expenseId" element={<ExpencesAdminById />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:userId" element={<AdminOrdersByUser />} />
            <Route path="add-products" element={<AddProduct />} />
            <Route path="managers" element={<ManagerList />} />
            <Route path="area-managers" element={<AreaManagerList />} />
            <Route path="zonal-managers" element={<ZonalManagerList />} />
            <Route path="raise-tickets" element={<GetRaisedTicket />} />

            <Route path="send-notification" element={<SendNotification />} />

          </Route>
        </Route>

        {/* Super Admin Dashboard */}
        <Route element={<ProtectedRoute role="Super Admin" />}>
          <Route path="/super-admin-dashboard" element={<RoleDashboard />}>
            <Route index element={<SuperAdminHome />} />
          </Route>
        </Route>

        {/* Opps Team Dashboard */}
        <Route element={<ProtectedRoute role="Opps Team" />}>
          <Route path="/opps-team-dashboard" element={<RoleDashboard />}>
            <Route index element={<OppsTeamHome />} />
          </Route>
        </Route>

        {/* National Head Dashboard */}
        <Route element={<ProtectedRoute role="National Head" />}>
          <Route path="/national-head-dashboard" element={<RoleDashboard />}>
            <Route index element={<NationalHeadHome />} />
          </Route>
        </Route>

        {/* State Head Dashboard */}
        <Route element={<ProtectedRoute role="State Head" />}>
          <Route path="/state-head-dashboard" element={<RoleDashboard />}>
            <Route index element={<StateHeadHome />} />
          </Route>
        </Route>

        {/* Zonal Manager Dashboard */}
        <Route element={<ProtectedRoute role="Zonal Manager" />}>
          <Route path="/zonal-manager-dashboard" element={<RoleDashboard />}>
            <Route index element={<ZonalManagerHome />} />
          </Route>
        </Route>

        {/* Area Manager Dashboard */}
        <Route element={<ProtectedRoute role="Area Manager" />}>
          <Route path="/area-manager-dashboard" element={<RoleDashboard />}>
            <Route index element={<AreaManagerHome />} />
          </Route>
        </Route>

        {/* Manager Dashboard */}
        <Route element={<ProtectedRoute role="Manager" />}>
          <Route path="/manager-dashboard" element={<RoleDashboard />}>
            <Route index element={<ManagerHome />} />
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
            <Route path="product/:productId" element={<SingleProduct />} />

            <Route path="order" element={<Orders />} />
            <Route path="expences" element={<Expences />} />

            <Route path="brochers-img" element={<Broucher />} />
            <Route path="daily-img" element={<DailyPost />} />
            <Route path="promotional-img" element={<PromotionImg />} />


            <Route path="add-chemist" element={<AddChemis />} />
            <Route path="chemist-visit" element={<ChemistVisiting />} />
            <Route path="add-stockist" element={<AddStockist />} />

            <Route path="stockist-visit" element={<StockistVisite />} />
            <Route path="rase-ticket" element={<RaiseTicket />} />
            <Route path="reports/*" element={<Report />} />
            <Route path="get-notification" element={<GetNotification />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
