import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, Check, Loader2, Users, Receipt, Calculator } from 'lucide-react';
import { useSelector } from 'react-redux';

const BASEURL = 'https://splitwise-backend-hd2z.onrender.com';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${BASEURL}/user/activity`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // Sort activities by date, newest first
        const sortedActivities = response.data.activities.sort((a, b) => 
          new Date(b.data.createdAt) - new Date(a.data.createdAt)
        );
        setActivities(sortedActivities);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchActivities();
    }
  }, [token]);

  const markAsRead = async (activity) => {
    try {
      const endpoint = getMarkAsReadEndpoint(activity);
      if (!endpoint) return;

      await axios.post(`${BASEURL}${endpoint}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setActivities(activities.map(a => 
        a.data._id === activity.data._id 
          ? { ...a, data: { ...a.data, readList: [...a.data.readList, user] }} 
          : a
      ));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const getMarkAsReadEndpoint = (activity) => {
    switch (activity.type) {
      case 'expense':
        return `/expenses/${activity.data._id}/mark-as-read`;
      case 'simplifiedPayment':
        return `/simplified-payments/${activity.data._id}/mark-as-read`;
      case 'settlement':
        return `/settlements/${activity.data._id}/mark-as-read`;
      default:
        return null;
    }
  };

  const handleNotificationClick = (activity) => {
    const { data } = activity;
    
    if (!data.readList.includes(user)) {
      markAsRead(activity);
    }

    if (data.group) {
      navigate(`/groups/${data.group._id}`);
    } else {
      const otherUser = activity.type === 'simplifiedPayment' 
        ? data.payments[0].payer._id === user 
          ? data.payments[0].payee._id 
          : data.payments[0].payer._id
        : data.splits.find(split => split.user._id !== user)?._id;
      
      if (otherUser) {
        navigate(`/friend/${otherUser}`);
      }
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'expense':
        return <Receipt className="h-5 w-5 text-purple-500" />;
      case 'simplifiedPayment':
        return <Calculator className="h-5 w-5 text-green-500" />;
      case 'settlement':
        return <Users className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationContent = (activity) => {
    const { type, data } = activity;
    
    switch (type) {
      case 'expense':
        return {
          title: data.description,
          amount: `₹${data.payers[0].amount}`,
          subtitle: data.group ? `in ${data.group.name}` : 'Personal expense',
          time: formatTime(new Date(data.createdAt))
        };
      case 'simplifiedPayment':
        return {
          title: 'Payment Simplified',
          amount: `₹${data.payments[0].amount}`,
          subtitle: data.group ? `in ${data.group.name}` : 'Personal payment',
          time: formatTime(new Date(data.createdAt))
        };
      case 'settlement':
        return {
          title: 'New Settlement',
          amount: `₹${data.settlements.reduce((sum, s) => sum + s.amount, 0)}`,
          subtitle: data.group ? `in ${data.group.name}` : 'Personal settlement',
          time: formatTime(new Date(data.createdAt))
        };
      default:
        return {
          title: 'New Activity',
          amount: '',
          subtitle: '',
          time: formatTime(new Date(data.createdAt))
        };
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        {activities.length > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {activities.length} notifications
          </span>
        )}
      </div>
      
      {activities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
          <p className="text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const content = getNotificationContent(activity);
            return (
              <div 
                key={activity.data._id}
                onClick={() => handleNotificationClick(activity)}
                className={`
                  bg-white rounded-lg shadow p-4 cursor-pointer
                  transition-all duration-200 hover:shadow-md hover:bg-gray-50
                  ${activity.data.readList.includes(user) ? '' : 'border-l-4 border-blue-500'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {content.title}
                      </p>
                      <span className="text-sm font-semibold text-gray-900">
                        {content.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        {content.subtitle}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {content.time}
                        </span>
                        {activity.data.readList.includes(user) && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Activities;