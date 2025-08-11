import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../BaseUrl/baseUrl';
import { 
  FiPower, 
  FiUser, 
  FiCalendar, 
  FiImage, 
  FiArrowLeft, 
  FiSearch,
  FiFilter,
  FiAlertCircle,
  FiClock,
  FiRefreshCw,
  FiUsers,
  FiFileText,
  FiTag,

} from 'react-icons/fi';

const GetRaisedTicket = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!user) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const endpoint = user.role === 'Admin' ? '/tickets' : '/tickets/user';

      const response = await fetch(`${BASE_URL}/api${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch tickets');
      }

      const data = await response.json();
      console.log('Fetched tickets:', data);

      const sanitizedTickets = data.map((ticket) => ({
        ...ticket,
        userId: ticket.userId ? ticket.userId.toString() : 'unknown',
      }));
      setTickets(sanitizedTickets);

      if (user.role === 'Admin') {
        const userTicketCounts = sanitizedTickets.reduce((acc, ticket) => {
          const userId = ticket.userId;
          if (userId && userId !== 'unknown') {
            if (!acc[userId]) {
              acc[userId] = {
                userId,
                userName: ticket.userName || 'Unknown User',
                ticketCount: 0,
                latestTicket: ticket.createdAt,
              };
            }
            acc[userId].ticketCount += 1;
            // Keep track of latest ticket
            if (new Date(ticket.createdAt) > new Date(acc[userId].latestTicket)) {
              acc[userId].latestTicket = ticket.createdAt;
            }
          }
          return acc;
        }, {});

        const uniqueUsers = Object.values(userTicketCounts);
        console.log('Unique users:', uniqueUsers);
        setUsers(uniqueUsers);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = selectedUserId
    ? tickets.filter((ticket) => ticket.userId && ticket.userId === selectedUserId)
    : tickets;

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleBack = () => {
    setSelectedUserId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getTicketStats = () => {
    const total = tickets.length;
    const today = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      const todayDate = new Date();
      return ticketDate.toDateString() === todayDate.toDateString();
    }).length;
    const thisWeek = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return ticketDate >= weekAgo;
    }).length;

    return { total, today, thisWeek };
  };

  const stats = getTicketStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Tickets</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchTickets}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center mx-auto"
            >
              <FiRefreshCw className="mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                  <FiPower className="w-6 h-6 text-white" />
                </div>
                {user.role === 'Admin'
                  ? selectedUserId
                    ? `Tickets for ${users.find((u) => u.userId === selectedUserId)?.userName}`
                    : 'Support Tickets Dashboard'
                  : 'My Support Tickets'}
              </h1>
              <p className="text-gray-600 mt-2">
                {user.role === 'Admin' 
                  ? 'Manage and track all support tickets from users'
                  : 'View and track your submitted support tickets'
                }
              </p>
            </div>
            <button
              onClick={fetchTickets}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          {user.role === 'Admin' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiPower className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.thisWeek}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {user.role === 'Admin' && !selectedUserId ? (
            <motion.div
              key="users-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>

              {/* Users Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No users with tickets found</p>
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <motion.div
                      key={u.userId}
                      onClick={() => handleUserClick(u.userId)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                          <FiUser className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="bg-purple-100 text-purple-800 text-sm font-bold px-3 py-1 rounded-full">
                          {u.ticketCount} tickets
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {u.userName}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-center">
                          <FiTag className="w-4 h-4 mr-2" />
                          ID: {u.userId.slice(-8)}
                        </p>
                        <p className="flex items-center">
                          <FiClock className="w-4 h-4 mr-2" />
                          Latest: {formatDate(u.latestTicket)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tickets-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button for Admin */}
              {user.role === 'Admin' && selectedUserId && (
                <button
                  onClick={handleBack}
                  className="mb-6 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to Users
                </button>
              )}

              {/* Tickets */}
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiPower className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tickets Found</h3>
                  <p className="text-gray-500">There are no support tickets to display at this time.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredTickets.map((ticket, index) => (
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                            <FiPower className="mr-3 text-purple-600" />
                            {ticket.title}
                          </h3>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span className="flex items-center">
                              <FiUser className="w-4 h-4 mr-2" />
                              {ticket.userName || 'Unknown User'}
                            </span>
                            <span className="flex items-center">
                              <FiCalendar className="w-4 h-4 mr-2" />
                              {formatDate(ticket.createdAt)}
                            </span>
                            <span className="flex items-center">
                              <FiTag className="w-4 h-4 mr-2" />
                              ID: {ticket.userId ? ticket.userId.slice(-8) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                          <FiFileText className="inline mr-2" />
                          Description
                        </label>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {ticket.description}
                          </p>
                        </div>
                      </div>

                      {ticket.image && (
                        <div className="mb-6">
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                            <FiImage className="inline mr-2" />
                            Attachment
                          </label>
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <img
                              src={ticket.image}
                              alt="Ticket attachment"
                              className="max-w-md rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                              onClick={() => window.open(ticket.image, '_blank')}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Ticket #{ticket._id.slice(-8)}</span>
                          <span>•</span>
                          <span>Submitted {formatDate(ticket.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                            Open
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GetRaisedTicket;