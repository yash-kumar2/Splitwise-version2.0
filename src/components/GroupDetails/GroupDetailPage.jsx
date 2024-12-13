import { useEffect,useState } from 'react';
import React from 'react';
//import ExpenseCard from '../Expenses/ExpenseCard';
//import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Modal } from 'antd';
import AddMembers from './AddMembers'; 
// // import { FormControl } from '@mui/material';
// // import Select from '@mui/material';
// import { Select } from '@mui/material';
import { FormControl } from '@mui/material';
import {Select,MenuItem,TextField} from '@mui/material';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import MemberTable from './MemberTable';
// import Select from '@mui/material';
// import MenuItem from '@mui/material';

// const GroupDetailPage = () => {
//   const token = useSelector((state) => state.auth.token);
//   const BASEURL='http://localhost:3000'
//   let { id } = useParams();
//   console.log(id)
//   const fetchData = async () => {
    
//     try {
//       const result = await axios
//         .get(`${BASEURL}/groups/${id}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((response) => response.data);
//         console.log(result)
    
//       setExpenses(result.expenses)
//       setGroup(result)
//       console.log("??????????>>>>>>>>>>>>>?????????????")
//       console.log(result.friends)
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   const [members,setMembers]=useState([])
//   const fetchMembersData = async () => {
    
//     try {
//       const result = await axios
//         .get(`${BASEURL}/groups/${id}/members`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((response) => response.data);
//         console.log("sdfsdfsdsdf")
//         console.log(result)
//       setMembers(result.members)
      
      
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   useEffect(()=>{
//       fetchData()
//       fetchMembersData()
//   },[id])
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const showModal = () => {
//     setIsModalOpen(true);
//   };
//   const handleOk = () => {
//     addExpense();
//     setIsModalOpen(false);
//   };
//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };
   
//   // Hardcoded group and expenses data for testing
//   // const group = {
    
//   //   id: '1',
//   //   name: 'Family Vacation',
//   //   members: [
//   //     { id: '1', name: 'Alice', amountOwed: 150 },
//   //     { id: '2', name: 'Bob', amountOwed: -100 },
//   //     { id: '3', name: 'Charlie', amountOwed: 50 },
//   //   ],
//   // };
//   const [expenses,setExpenses]=useState([])
//   const [group,setGroup]=useState([])

//   // const expenses = [
//   //   {
//   //     id: '1',
//   //     description: 'Hotel Booking',
//   //     createdAt: '2023-03-22T12:34:56Z',
//   //     amount: 300,
//   //     for: { name: 'Bob' },
//   //   },
//   //   {
//   //     id: '2',
//   //     description: 'Flight Tickets',
//   //     createdAt: '2023-03-15T08:12:34Z',
//   //     amount: -200,
//   //     for: { name: 'Alice' },
//   //   },
//   //   {
//   //     id: '3',
//   //     description: 'Dinner',
//   //     createdAt: '2023-04-10T18:00:00Z',
//   //     amount: 100,
//   //     for: { name: 'Charlie' },
//   //   },
//   //   {
//   //     id: '4',
//   //     description: 'Museum Tickets',
//   //     createdAt: '2023-04-05T14:00:00Z',
//   //     amount: -150,
//   //     for: { name: 'Alice' },
//   //   },
//   // ];

//   // Sort expenses globally by createdAt date
//   const sortedExpenses = [...expenses].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//   // Group and sort by month
//   const groupExpensesByMonth = sortedExpenses.reduce((acc, expense) => {
//     const month = new Date(expense.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//     if (!acc[month]) {
//       acc[month] = [];
//     }
//     acc[month].push(expense);
//     return acc;
//   }, {});

//   // Get sorted months array and reverse it
//   const sortedMonths = Object.keys(groupExpensesByMonth).sort((a, b) => {
//     const dateA = new Date(groupExpensesByMonth[a][0].createdAt);
//     const dateB = new Date(groupExpensesByMonth[b][0].createdAt);
//     return dateA - dateB;
//   }).reverse();

//   // Sort expenses within each month by createdAt date in descending order
//   Object.keys(groupExpensesByMonth).forEach((month) => {
//     groupExpensesByMonth[month].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//   });
//   const [payerEmail, setPayerEmail] = React.useState('');

//   const handleChange = (event) => {
//     console.log(";;:::::::")
//     console.log(event.target.value)
//     setPayerEmail(event.target.value);
//   };
//   const [inputValue, setInputValue] = useState('');
//   const [amountPaid, setAmountPaid] = useState(0);

//   const handleInputChange = (event) => {
//     setInputValue(event.target.value);
//     setAmountPaid(event.target.value)
//     console.log(event.target.value)
//   };
//   const [defaultChecked, setDefaultChecked] = useState(true);
//   const handleDefaultCheckedChange = (event) => {
//     setDefaultChecked(event.target.checked);
//   };
  

//   const [memberAmounts, setMemberAmounts] = useState({});
//   const handleAmountChange = (email, amount) => {
//     setMemberAmounts((prevAmounts) => ({
//       ...prevAmounts,
//       [email]: amount,
//     }))
//     console.log(memberAmounts)
    
    
//     ;
//   };
//   const handleDescriptionChange = (event) => {
//     setDescription(event.target.value);
//   };

//   const [description, setDescription] = useState('');

//   const addExpense = async () => {
//     console.log(memberAmounts);
//     console.log(amountPaid);
//     console.log(members)
//     console.log("<<>>")
//     let expensesArray = !defaultChecked 
//     ? Object.keys(memberAmounts).map(email => ({
//         email: email, // Use the key directly
//         amount: memberAmounts[email] // Access the amount with the key
//     })) 
//     : members.map(member => ({
//         email: member.email, // Access email from member object
//         amount: (amountPaid / members.length).toFixed(2)
//     }));
//     let newarr=Object.keys(memberAmounts).map(email => ({
//       email: email, // Use the key directly
//       amount: memberAmounts[email] // Access the amount with the key
//   })) 
//   console.log("chekre")
//   console.log(defaultChecked)
//   console.log(memberAmounts)
  

  

//     const data = {
//       payerEmail,
//       description,
//       expenses: expensesArray
//     };
//     console.log("Klll<<>>")
//      console.log(data)
//     try {
//       await axios.post(`${BASEURL}/groups/${id}/addexpense`, data, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setIsModalOpen(false);
//       fetchData(); // Refresh the data
//     } catch (error) {
//       console.error("Error adding expense:", error);
//     }
//   };


//   const addMembersToGroup = async (emails) => {
//     try {
//       const result = await axios.post(`${BASEURL}/groups/${id}/members`, { emails }, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       fetchMembersData(); // Refresh the members list
//     } catch (error) {
//       console.error('Error adding members:', error);
//     }
//   };

//   return (
    
//     <div className="container mx-auto  p-4 overflow-auto">
    
//       {group.friends && (

//         <div>
//           <h1 className="text-2xl font-bold text-blue-600 mb-4">{group.description}</h1>
//           <h2 className="text-xl font-semibold mb-2">Owed Amounts</h2>
          
//           <ul className="mb-4">
//             {group.friends.map((member) => (
//               <li key={member.id} className="mb-1">
//                 <span className={member.amount > 0 ? 'text-green-500' : 'text-red-500'}>
//                   {member.amount > 0
//                     ? `${member.name} owes you ₹${member.amount}`
//                     : `You owe ${member.name} ₹${-member.amount}`}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <AddMembers friends={group.friends || []} addMembers={addMembersToGroup} />
//       <h2 className="text-xl font-semibold mb-2">Expenses</h2>
//       <div>
//         {sortedMonths.map((month) => (
//           <div key={month} className="mb-6">
//             <h3 className="text-lg font-bold mb-2">{month}</h3>
//             {groupExpensesByMonth[month].map((expense) => (
//               <ExpenseCard key={expense.id} expense={expense} />
//             ))}
//           </div>
//         ))}
//       </div>
//       <button className="fixed bottom-[100px] right-10 px-4 py-4 m-3  rounded-xl bg-blue-100" onClick={showModal} >
//   Add Expense
// </button>
// <Modal title="Add Expense" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
// centered >
//   <div className='flex justify-stretch items-center space-x-1'>
//           <p className='w-20'>Description:</p>
//           <TextField id="description-basic" label="Description" onChange={handleDescriptionChange} variant="standard" />
//         </div>
//   <div className='flex justify-stretch items-center space-x-1 mt-5'>
//      <p className='w-20'>paid by:</p>
//         <FormControl fullWidth>

//   <Select
//     labelId="demo-simple-select-label"
//     id="demo-simple-select"
//     value={payerEmail}
//     label="Age"
//     onChange={handleChange}
//   >
//     {
//       members.map((data)=>{ 
//         console.log(data)
        
//         return (<MenuItem value={data.email}>{data.name}</MenuItem> )})
//     }
    
//   </Select>
// </FormControl></div>
// {defaultChecked&&<div className='flex justify-stretch items-center space-x-1 mt-5'>
// <p className='w-20'>Amount paid:</p>
// <TextField id="standard-basic" label="rupees" onChange={handleInputChange} variant="standard" />

  
// </div>}
// <div className='flex justify-center items-center space-x-1 mt-5'>
// <FormGroup>
//       <FormControlLabel
//         control={
//           <Switch
//             checked={defaultChecked}
//             onChange={handleDefaultCheckedChange}

//           />
//         }
//         labelPlacement="start"
//         label="Split Evenly"
//       />
    
//     </FormGroup>
  
// </div>

// {!defaultChecked&&<MemberTable members={members} memberAmounts={memberAmounts} handleAmountChange={handleAmountChange} />}



//       </Modal>

//     </div>
//   );
// };

// export default GroupDetailPage;
//import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupDetailPage = ({ groupId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
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
  if (activities.length === 0) return <div>No activities found.</div>;

  return (
    <div className="space-y-4 p-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-700">Group Activities</h1>
      {activities.map((activity) => {
        switch (activity.type) {
          case "expense":
            return <ExpenseCard key={activity._id} expense={activity} />;
          case "settlement":
            return <SettlementCard key={activity._id} settlement={activity} />;
          case "simplifiedSettlement":
            return <SimplifiedSettlementCard key={activity._id} payment={activity} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

const ExpenseCard = ({ expense }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold">{expense.description}</h2>
      <p className="text-gray-600 text-sm">
        Date: {new Date(expense.createdAt).toLocaleDateString()} | Created by: {expense.createdBy.email}
      </p>
      <p className="mt-2 font-semibold">Payers:</p>
      <ul className="list-disc list-inside text-gray-700">
        {expense.payers.map((payer) => (
          <li key={payer._id}>
            {payer.user.userId}: ${payer.amount}
          </li>
        ))}
      </ul>
      <p className="mt-2 font-semibold">Splits:</p>
      <ul className="list-disc list-inside text-gray-700">
        {expense.splits.map((split) => (
          <li key={split._id}>
            {split.user.userId}: ${split.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

const SettlementCard = ({ settlement }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
      <span className="text-green-500 text-2xl material-icons">paid</span>
      <div className="ml-4">
        <h2 className="text-xl font-semibold">Settlement</h2>
        <p className="text-gray-600 text-sm">
          Date: {new Date(settlement.createdAt).toLocaleDateString()}
        </p>
        <ul className="list-disc list-inside text-gray-700">
          {settlement.payments.map((payment) => (
            <li key={payment._id}>
              {payment.payer.userId} paid {payment.payee.userId} ${payment.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const SimplifiedSettlementCard = ({ payment }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
      <span className="text-blue-500 text-2xl material-icons">settings</span>
      <div className="ml-4">
        <h2 className="text-xl font-semibold">Simplified Settlement</h2>
        <p className="text-gray-600 text-sm">
          Date: {new Date(payment.createdAt).toLocaleDateString()}
        </p>
        <ul className="list-disc list-inside text-gray-700">
          {payment.payments.map((payment) => (
            <li key={payment._id}>
              {payment.payer.userId} paid {payment.payee.userId} ${payment.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupDetailPage;
