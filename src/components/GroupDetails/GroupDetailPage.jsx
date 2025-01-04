import { useEffect,useState } from 'react';
import React from 'react';
//import ExpenseCard from '../Expenses/ExpenseCard';
//import axios from 'axios';
import ExpenseCard from '../Expenses/ExpenseCard';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Modal } from 'antd';
import AddMembers from './AddMembers'; 
// // import { FormControl } from '@mui/material';
// // import Select from '@mui/material';
// import { Select } from '@mui/material';
import { FormControl, getNativeSelectUtilityClasses } from '@mui/material';
import SimplifiedSettlementCard from '../Expenses/SimplifiedSettlementCard';
import {Select,MenuItem,TextField} from '@mui/material';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import MemberTable from './MemberTable';
import { Receipt, DollarSign, Calculator ,Plus} from 'lucide-react';
import GroupBalancesComponent from './GroupBalancesComponent';
import ExpenseModal from './ExpenseModal';
import AddUsersToGroup from './AddMembers';

import axios from 'axios';

const GroupDetailPage = ({ groupId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [selectedSimplifiedSettlement, setSelectedSimplifiedSettlement] = useState(null);
  const [user,setUser]=useState(getNativeSelectUtilityClasses)
  const [modalOpen,setModalOpen]=useState(false)
  const [visible,setVisible]=useState(false)
  const [visible2, setVisible2] = useState(false);
    const BASEURL='http://localhost:3000'
  let { id } = useParams();
  groupId=id
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${BASEURL}/group/${groupId}/activities`,{
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  });
        const allActivities = [
          ...response.data.expenses.map((expense) => ({ ...expense, type: "expense" })),
          ...response.data.settlements.map((settlement) => ({ ...settlement, type: "settlement" })),
          ...response.data.simplifiedPayments.map((payment) => ({ ...payment, type: "simplifiedSettlement" })),
        ];
        setUser(response.data.user)
        const sortedActivities = allActivities.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setActivities(sortedActivities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [groupId]);

  if (loading) return <div>Loading...</div>;
 // if (activities.length === 0) return <div>No activities found.</div>;

  return (
    <div className="space-y-4 p-4 bg-gray-100">
      
     <GroupBalancesComponent/>
     <ExpenseModal visible={visible} setVisible={setVisible} groupId={groupId} token={token}/>
     <AddUsersToGroup token={token} groupId={groupId} setVisible={setVisible2} visible={visible2}/>
     
      <h1 className="text-2xl font-bold text-gray-700">Group Activities</h1>
      {activities.map((activity) => {
         {console.log(activity)}
        switch (activity.type) {
          case "expense":
            return <ExpenseCard key={activity._id} expense={activity} user={user} modalOpen={modalOpen} setModalOpen={setModalOpen} />;
          case "settlement":
            return <SettlementCard key={activity._id} settlement={activity} modalOpen={modalOpen} setModalOpen={setModalOpen} />;
          case "simplifiedSettlement":
            return <SimplifiedSettlementCard key={activity._id} settlement={activity} modalOpen={modalOpen} setModalOpen={setModalOpen}/>;
          default:
            return null;
        }
      })}
     
      {/* <button 
  className="fixed bottom-[170px] right-10 px-6 py-4 rounded-full bg-blue-700 
  text-white font-medium shadow-lg hover:bg-blue-600 active:bg-blue-700 
  transform hover:scale-105 transition-all duration-200 flex items-center gap-2 
  hover:shadow-xl active:scale-95"
  onClick={()=>{setVisible2(true)}}
>
  <Plus size={20} />
  Add Users
</button> */}
      <button 
  className="fixed bottom-[100px] right-10 px-6 py-4 rounded-full bg-blue-500 
  text-white font-medium shadow-lg hover:bg-blue-600 active:bg-blue-700 
  transform hover:scale-105 transition-all duration-200 flex items-center gap-2 
  hover:shadow-xl active:scale-95"
  onClick={()=>{setVisible(true)}}
>
  <Plus size={20} />
  Add Expense
</button>
    </div>
    
  );
};


const SettlementCard = ({ settlement, onCardClick }) => {
  return (
    <div 
      className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300 flex items-center"
      onClick={() => onCardClick(settlement)}
    >
      <DollarSign className="mr-2 text-green-500" size={24} />
      <div>
        <h2 className="text-xl font-semibold">Settlement</h2>
        <p className="text-gray-600 text-sm">
          Date: {new Date(settlement.createdAt).toLocaleDateString()}
        </p>
        <div className="mt-2 text-gray-700">
          {settlement.payments.slice(0, 2).map((payment, index) => (
            <div key={payment._id}>
              {payment.payer.userId} paid {payment.payee.userId} ₹{payment.amount}
            </div>
          ))}
          {settlement.payments.length > 2 && (
            <div className="text-sm text-gray-500">
              + {settlement.payments.length - 2} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettlementDetailModal = ({ settlement, open, onClose }) => {
  if (!settlement) return null;

  return (
    <Modal
      title="Settlement Details"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-4">
        <p><strong>Date:</strong> {new Date(settlement.createdAt).toLocaleString()}</p>
        
        <h3 className="text-lg font-semibold mb-2">Payments</h3>
        <ul className="list-disc list-inside text-gray-700">
          {settlement.payments.map((payment) => (
            <li key={payment._id}>
              {payment.payer.userId} paid {payment.payee.userId} ₹{payment.amount}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};


export default GroupDetailPage;
