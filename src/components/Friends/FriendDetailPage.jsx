import { useEffect, useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Modal, Spin } from 'antd';
import { DollarSign, Plus, Receipt } from 'lucide-react';
import axios from 'axios';
import ExpenseCard from '../Expenses/ExpenseCard';
import SimplifiedSettlementCard from '../Expenses/SimplifiedSettlementCard';


const FriendDetailPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friend, setFriend] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const BASEURL = 'http://localhost:3000';
   const [user,setUser]=useState()
  
  
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${BASEURL}/friend/${id}/activity`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setActivities(response.data.activities);
        setUser(response.data.user)
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchActivities();
    }
  }, [id, token]);

  const openActivityModal = (activity) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Friend Activity History</h1>
      </div>

      {activities.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No activities found with this friend
        </div>
      ) : (
        <div className="space-y-4">
          {/* {activities.map((activity) => (
            <div key={activity.data._id} onClick={() => openActivityModal(activity)}>
              {activity.type === "expense" ? (
                <ExpenseActivity expense={activity.data} />
              ) : (
                <PaymentActivity payment={activity.data} />
              )}
            </div>
          ))} */}

       {activities.map((activity) => {
        {console.log(activity)}
        switch (activity.type) {
          case "expense":
            return <ExpenseCard key={activity._id} expense={activity.data} user={user} modalOpen={modalOpen} setModalOpen={setModalOpen} mode={"friend"}/>;
          case "settlement":
            return <SettlementCard key={activity._id} settlement={activity.data} modalOpen={modalOpen} setModalOpen={setModalOpen}  mode={"friend"}/>;
          case "simplifiedPayment":
            return <SimplifiedSettlementCard key={activity._id} settlement={activity.data} modalOpen={modalOpen} setModalOpen={setModalOpen} mode={"friend"}/>;
          default:
            return null;
        }
      })}
        </div>
      )}

      <ActivityDetailModal
        activity={selectedActivity}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedActivity(null);
        }}
      />

      <button 
        className="fixed bottom-[100px] right-10 px-6 py-4 rounded-full bg-blue-500 
        text-white font-medium shadow-lg hover:bg-blue-600 active:bg-blue-700 
        transform hover:scale-105 transition-all duration-200 flex items-center gap-2 
        hover:shadow-xl active:scale-95"
        onClick={() => {/* Add expense logic */}}
      >
        <Plus size={20} />
        Add Expense
      </button>
    </div>
  );
};

const ExpenseActivity = ({ expense }) => {
  const totalAmount = expense.payers.reduce((sum, payer) => sum + payer.amount, 0);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <Receipt className="text-blue-500" size={24} />
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{expense.description}</h3>
          <p className="text-sm text-gray-500">
            {new Date(expense.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2">
            <p className="text-gray-700">Total: ₹{totalAmount}</p>
            <div className="text-sm text-gray-600 mt-1">
              {expense.payers.map(payer => (
                <span key={payer._id}>
                  {payer.user.userId} paid ₹{payer.amount}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentActivity = ({ payment }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <DollarSign className="text-green-500" size={24} />
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">Settlement</h3>
          <p className="text-sm text-gray-500">
            {new Date(payment.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2">
            {payment.payments.map((p, index) => (
              <div key={p._id} className="text-gray-700">
                {p.payer.userId} paid ₹{p.amount} to {p.payee.userId}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityDetailModal = ({ activity, open, onClose }) => {
  if (!activity) return null;

  const isExpense = activity.type === "expense";

  return (
    <Modal
      title={isExpense ? "Expense Details" : "Settlement Details"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-4">
        {isExpense ? (
          <>
            <h3 className="text-xl font-semibold">{activity.data.description}</h3>
            <p className="text-gray-600">
              Date: {new Date(activity.data.createdAt).toLocaleString()}
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Paid by:</h4>
              {activity.data.payers.map(payer => (
                <div key={payer._id}>
                  {payer.user.userId}: ₹{payer.amount}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Split between:</h4>
              {activity.data.splits.map(split => (
                <div key={split._id}>
                  {split.user.userId}: ₹{split.amount}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600">
              Date: {new Date(activity.data.createdAt).toLocaleString()}
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Payments:</h4>
              {activity.data.payments.map(payment => (
                <div key={payment._id}>
                  {payment.payer.userId} paid ₹{payment.amount} to {payment.payee.userId}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default FriendDetailPage;