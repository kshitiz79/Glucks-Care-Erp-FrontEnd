import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchDoctors } from '../../api/doctorApi';
import { fetchStockists } from '../../api/stockistApi';
import { fetchChemists } from '../../api/chemistApi';
import { fetchChemistVisits } from '../../api/chemistApi';
import { fetchSalesByUser } from '../../api/salesApi';
import { motion } from 'framer-motion';
import { Bar, Pie, Line } from 'react-chartjs-2'; // Import Line chart
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement, // For line charts
  PointElement, // For line charts
} from 'chart.js';
import BASE_URL from '../../BaseUrl/baseUrl';

// Register all necessary Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement // Register PointElement for line charts
);

const UserDashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    doctors: [],
    stockists: [],
    chemists: [],
    chemistVisits: [],
    sales: [],
    expenses: [],
    tickets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [
          doctorsData,
          stockistsData,
          chemistsData,
          chemistVisitsData,
          salesData,
          expensesData,
          ticketsData,
        ] = await Promise.all([
          fetchDoctors().catch(() => []),
          fetchStockists().catch(() => []),
          fetchChemists().catch(() => []),
          fetchChemistVisits(user.id).catch(() => []),
          fetchSalesByUser(user.id).catch(() => []),
          fetch(`${BASE_URL}/api/expenses?userId=${user.id}`).then(res => res.json()).catch(() => []),
          fetch(`${BASE_URL}/api/tickets/user`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }).then(res => res.json()).catch(() => []),
        ]);

        setDashboardData({
          doctors: Array.isArray(doctorsData) ? doctorsData : doctorsData.Data || [],
          stockists: Array.isArray(stockistsData) ? stockistsData : stockistsData.Data || [],
          chemists: Array.isArray(chemistsData) ? chemistsData : chemistsData.Data || [],
          chemistVisits: Array.isArray(chemistVisitsData) ? chemistVisitsData : chemistVisitsData.Data || [],
          sales: Array.isArray(salesData) ? salesData : salesData.Data || [],
          expenses: Array.isArray(expensesData) ? expensesData : expensesData.Data || [],
          tickets: Array.isArray(ticketsData) ? ticketsData : ticketsData.Data || [],
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate metrics for display
  const totalDoctors = dashboardData.doctors.length;
  const totalStockists = dashboardData.stockists.length;
  const totalChemists = dashboardData.chemists.length;
  const totalVisits = dashboardData.chemistVisits.length;
  const confirmedVisits = dashboardData.chemistVisits.filter(v => v.confirmed).length;
  const unconfirmedVisits = totalVisits - confirmedVisits;
  const totalExpenses = dashboardData.expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0).toFixed(2);
  const ticketStatusCounts = dashboardData.tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});

  // Data for Pie Chart (Ticket Status)
  const pieChartData = {
    labels: Object.keys(ticketStatusCounts),
    datasets: [
      {
        data: Object.values(ticketStatusCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  // Data for Bar Chart (Expenses by Category)
  const expensesByCategory = dashboardData.expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount || 0);
    return acc;
  }, {});
  const barChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        label: 'Expenses by Category (RS)',
        data: Object.values(expensesByCategory),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Sales Trend Line Chart
  const salesTrendData = dashboardData.sales.reduce((acc, sale) => {
    // Assuming sale.saleDate is a string in 'YYYY-MM-DD' format
    const date = new Date(sale.saleDate);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + Number(sale.totalAmount || 0);
    return acc;
  }, {});

  const salesLineChartData = {
    labels: Object.keys(salesTrendData),
    datasets: [
      {
        label: 'Sales Trend (RS)',
        data: Object.values(salesTrendData),
        fill: false,
        borderColor: '#4BC0C0',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for Chemist Visits Trend Line Chart
  const chemistVisitsTrendData = dashboardData.chemistVisits.reduce((acc, visit) => {
    // Assuming visit.date is a string in 'YYYY-MM-DD' format
    const date = new Date(visit.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1; // Count each visit
    return acc;
  }, {});

  const chemistVisitsLineChartData = {
    labels: Object.keys(chemistVisitsTrendData),
    datasets: [
      {
        label: 'Chemist Visits Trend',
        data: Object.values(chemistVisitsTrendData),
        fill: false,
        borderColor: '#FFCE56',
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)', // Light grid lines for y-axis
        },
      },
    },
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Please log in to view the dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen font-inter" // Added font-inter for consistent font
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6 rounded-md p-2 shadow-sm">User Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Doctors</h2>
          <p className="text-4xl font-extrabold text-blue-600">{totalDoctors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Stockists</h2>
          <p className="text-4xl font-extrabold text-blue-600">{totalStockists}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Chemists</h2>
          <p className="text-4xl font-extrabold text-blue-600">{totalChemists}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Visits</h2>
          <p className="text-4xl font-extrabold text-blue-600">{totalVisits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Confirmed Visits</h2>
          <p className="text-4xl font-extrabold text-green-600">{confirmedVisits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Unconfirmed Visits</h2>
          <p className="text-4xl font-extrabold text-red-600">{unconfirmedVisits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Expenses</h2>
          <p className="text-4xl font-extrabold text-purple-600">RS {totalExpenses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Tickets</h2>
          <p className="text-4xl font-extrabold text-indigo-600">{dashboardData.tickets.length}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col"> {/* Added flex-col and h-96 */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Ticket Status Distribution</h2>
          <div className="flex-grow"> {/* Added flex-grow to make chart fill space */}
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col"> {/* Added flex-col and h-96 */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses by Category</h2>
          <div className="flex-grow"> {/* Added flex-grow to make chart fill space */}
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col"> {/* New chart, added flex-col and h-96 */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Trend Over Time</h2>
          <div className="flex-grow"> {/* Added flex-grow to make chart fill space */}
            <Line data={salesLineChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col"> {/* New chart, added flex-col and h-96 */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Chemist Visits Trend Over Time</h2>
          <div className="flex-grow"> {/* Added flex-grow to make chart fill space */}
            <Line data={chemistVisitsLineChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboardHome;