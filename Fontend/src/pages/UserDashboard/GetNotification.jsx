// src/components/GetNotification.jsx
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from './../../context/AuthContext';
import BASE_URL from './../../BaseUrl/baseUrl';
import { FiCheck, FiTrash2, FiClock, FiBell, FiUser, FiHome, FiAlertCircle } from 'react-icons/fi';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';

const GetNotification = () => {
  const { user, headOffice } = useContext(AuthContext);
  const userId = user?._id || user?.id;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setError('Please log in to view notifications.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // Fetch notifications list
      const resList = await fetch(
        `${BASE_URL}/api/notifications?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000) }
      );
      if (!resList.ok) {
        const err = await resList.json();
        throw new Error(err.error || resList.statusText);
      }
      const data = await resList.json();
      setNotifications(data);

      // Fetch unread count
      const resCount = await fetch(
        `${BASE_URL}/api/notifications/count?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000) }
      );
      if (!resCount.ok) {
        const err = await resCount.json();
        throw new Error(err.error || resCount.statusText);
      }
      const { count = 0 } = await resCount.json();
      setUnreadCount(count);
    } catch (err) {
      console.error('fetchNotifications error:', err);
      setError(`Could not load notifications: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    } else {
      setError('Please log in to view notifications.');
      setLoading(false);
    }
  }, [userId, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${BASE_URL}/api/notifications/${id}/read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }
      fetchNotifications();
    } catch (err) {
      console.error('markAsRead error:', err);
      setError(`Failed to mark as read: ${err.message}`);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${BASE_URL}/api/notifications/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('deleteNotification error:', err);
      setError(`Failed to delete notification: ${err.message}`);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${BASE_URL}/api/notifications`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('deleteAllNotifications error:', err);
      setError(`Failed to clear notifications: ${err.message}`);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${BASE_URL}/api/notifications/mark-all-read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }
      fetchNotifications();
    } catch (err) {
      console.error('markAllAsRead error:', err);
      setError(`Failed to mark all as read: ${err.message}`);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') {
      const rec = notification.recipients.find((r) => r.user.toString() === userId);
      return rec?.isRead !== true;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* User Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white rounded-full shadow">
            <FiUser className="text-indigo-600 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                {user.role}
              </span>
              {headOffice && (
                <span className="flex items-center text-sm text-gray-600">
                  <FiHome className="mr-1" /> {headOffice.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
      >
        <div className="flex items-center">
          <FiBell className="text-indigo-600 text-2xl mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          {unreadCount > 0 && (
            <span className="ml-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'all' 
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'unread' 
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
        
          <button
            onClick={deleteAllNotifications}
            disabled={notifications.length === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            Clear all
          </button>
        </div>
      </motion.header>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiBell className="mx-auto text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500">
              {activeTab === 'unread' 
                ? 'No unread notifications'
                : 'No notifications yet'}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification) => {
              const rec = notification.recipients.find(
                (r) => r.user.toString() === userId
              );
              const isRead = rec?.isRead === true;

              return (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-xl border transition-all ${
                    isRead 
                      ? 'bg-white border-gray-200' 
                      : 'bg-blue-50 border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between">
                    <h3 className={`text-lg font-semibold ${
                      isRead ? 'text-gray-800' : 'text-blue-800'
                    }`}>
                      {notification.title}
                    </h3>
                    <div className="flex space-x-2">
                      {!isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-1.5 text-green-600 hover:text-green-800 transition-colors"
                          title="Mark as read"
                        >
                          <FiCheck />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <p className={`mt-2 ${
                    isRead ? 'text-gray-600' : 'text-blue-700'
                  }`}>
                    {notification.body}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <small className={`text-xs flex items-center ${
                      isRead ? 'text-gray-400' : 'text-blue-500'
                    }`}>
                      <FiClock className="mr-1" />
                      {moment(notification.createdAt).fromNow()}
                    </small>
                    {!isRead && (
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default GetNotification;