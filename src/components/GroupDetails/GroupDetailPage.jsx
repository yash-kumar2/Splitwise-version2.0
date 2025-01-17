import { useEffect,useState } from 'react';
import React from 'react';
//import ExpenseCard from '../Expenses/ExpenseCard';
//import axios from 'axios';
import ExpenseCard from '../Expenses/ExpenseCard';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Modal,Button } from 'antd';
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
import CircleHelpIcon from './CircleHelp';
import AddSettlement from './AddSettlement';
import SettlementCard from '../Expenses/Settlement';

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
    const BASEURL='https://splitwise-backend-hd2z.onrender.com'
  let { id } = useParams();
  groupId=id
  const token = useSelector((state) => state.auth.token);
  const simplifyPayments= async ()=>{
    try{
    const response=await axios.post(`${BASEURL}/group/${groupId}/simplify-payments`,{},{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    }
    catch{
      console.error("Error simplifying payments:", error);

    }
  }



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
     <AddSettlement groupId={groupId}/>
     <div className='flex'>
     <Button type="primary" onClick={simplifyPayments} >
        Simplify System Payments
      </Button>
     <CircleHelpIcon modalOpen={modalOpen} setModalOpen={setModalOpen}/></div>
     
      <h1 className="text-2xl font-bold text-gray-700">Group Activities</h1>
      {activities.map((activity) => {
         {console.log(activity)}
        switch (activity.type) {
          case "expense":
            return <ExpenseCard key={activity._id} expense={activity} user={user} modalOpen={modalOpen} setModalOpen={setModalOpen} />;
          case "settlement":
            return <SettlementCard key={activity._id} settlement={activity} user={user} modalOpen={modalOpen} setModalOpen={setModalOpen} />;
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
