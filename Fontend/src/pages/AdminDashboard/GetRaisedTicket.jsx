import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../BaseUrl/baseUrl';

const GetRaisedTicket = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  if (!user) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    const fetchTickets = async () => {
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
          userId: ticket.userId.toString(),
        }));
        setTickets(sanitizedTickets);

        if (user.role === 'Admin') {
          const userTicketCounts = sanitizedTickets.reduce((acc, ticket) => {
            const userId = ticket.userId;
            if (!acc[userId]) {
              acc[userId] = {
                userId,
                userName: ticket.userName,
                ticketCount: 0,
              };
            }
            acc[userId].ticketCount += 1;
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

    fetchTickets();
  }, [user]);

  const filteredTickets = selectedUserId
    ? tickets.filter((ticket) => ticket.userId === selectedUserId)
    : [];

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleBack = () => {
    setSelectedUserId(null);
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {user.role === 'Admin'
          ? selectedUserId
            ? `Tickets for ${users.find((u) => u.userId === selectedUserId)?.userName}`
            : 'Users with Tickets'
          : 'My Tickets'}
      </h2>

      {user.role === 'Admin' && !selectedUserId ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {users.length === 0 ? (
            <p className="text-gray-600">No users with tickets found.</p>
          ) : (
            users.map((u) => (
              <div
                key={u.userId}
                className="p-6 border rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleUserClick(u.userId)}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  User ID: {u.userId.slice(-6)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Name: {u.userName}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tickets: {u.ticketCount}
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          {user.role === 'Admin' && selectedUserId && (
            <button
              onClick={handleBack}
              className="mb-6 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Back to Users
            </button>
          )}
          {(selectedUserId ? filteredTickets : tickets).length === 0 ? (
            <p className="text-gray-600">No tickets found.</p>
          ) : (
            <div className="grid gap-6">
              {(selectedUserId ? filteredTickets : tickets).map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-6 border rounded-lg shadow-md bg-white"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {ticket.title}
                  </h3>
                  <p className="text-gray-700 mt-2">{ticket.description}</p>
                  {ticket.image && (
                    <img
                      src={ticket.image}
                      alt="Ticket"
                      className="mt-4 max-w-xs rounded"
                    />
                  )}
                  <p className="text-sm text-gray-500 mt-3">
                    Submitted by: {ticket.userName} (ID: {ticket.userId.slice(-6)})
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GetRaisedTicket;