import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, Check, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const BASEURL = 'http://localhost:3000';

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
        setActivities(response.data.activities);
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

  const getNotificationContent = (activity) => {
    const { type, data } = activity;
    
    switch (type) {
      case 'expense':
        return `New expense: ${data.description} (${data.payers[0].amount})`;
      case 'simplifiedPayment':
        return `Payment simplified for ${data.payments[0].amount}`;
      default:
        return 'New activity';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>
      
      {activities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No notifications to show
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div 
              key={activity.data._id}
              onClick={() => handleNotificationClick(activity)}
              className={`
                bg-white rounded-lg shadow p-4 cursor-pointer
                transition-all duration-200 hover:shadow-md
                ${activity.data.readList.includes(user) ? 'bg-gray-50' : 'border-l-4 border-blue-500'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {getNotificationContent(activity)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.data.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {activity.data.readList.includes(user) && (
                  <Check className="h-5 w-5 text-green-500 ml-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;