import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const BASEURL = 'http://localhost:3000';

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${BASEURL}/activity`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const markAsRead = async (activityId) => {
    try {
      await axios.post(`${BASEURL}/activity/mark-read`, 
        { activityId }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchActivities(); // Refresh activities after marking as read
    } catch (error) {
      console.error("Error marking activity as read:", error);
    }
  };

  const unreadActivities = activities.filter(activity => !activity.isRead);
  const readActivities = activities.filter(activity => activity.isRead);

  return (
    <div className="p-6">
      {/* Unread Activities Section */}
      <h2 className="text-2xl font-bold mb-6">Unread Activities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {unreadActivities.map((activity, index) => (
          <div key={index} className="bg-orange-100 p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold">{activity.description}</h3>
            <p className="text-lg">
              {activity.type === 'paid'
                ? `You paid ${activity.for} ${activity.amount}`
                : `${activity.owner} paid you ${activity.amount}`}
            </p>
            <p className="text-sm text-gray-600">In group: {activity.groupName}</p>
            <p className="text-sm text-gray-600">Date: {new Date(activity.date).toLocaleDateString()}</p>
            <button
              onClick={() => markAsRead(activity.id)}
              className="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
            >
              Mark as Read
            </button>
          </div>
        ))}
      </div>

      {/* Read Activities Section */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Read Activities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {readActivities.map((activity, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold">{activity.description}</h3>
            <p className="text-lg">
              {activity.type === 'paid'
                ? `You paid ${activity.for} ${activity.amount}`
                : `${activity.owner} paid you ${activity.amount}`}
            </p>
            <p className="text-sm text-gray-600">In group: {activity.groupName}</p>
            <p className="text-sm text-gray-600">Date: {new Date(activity.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
