import React from 'react';
import { NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup,faPeopleGroup,faUser,faCalendarDays} from '@fortawesome/free-solid-svg-icons'
//import { HomeIcon, UserGroupIcon, CalendarIcon, UserIcon } from '@heroicons/react/outline';


const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around items-center p-4">
         <NavLink to="/groups" className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 durnpm i --save @fortawesome/react-fontawesome@latestation-200 ${isActive ? "text-orange-700" : "text-white-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }>
        
        <FontAwesomeIcon icon={faPeopleGroup}   className="block mx-auto my-1"/>
        <span>Groups</span>
      </NavLink>
      <NavLink to="/friends" className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-white-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }>
        <FontAwesomeIcon icon={faUserGroup}  className="block mx-auto my-1" />
        <span>Friends</span>

      </NavLink>
      <NavLink to="/activities" className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-white-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
>
       
<FontAwesomeIcon icon={faCalendarDays}  className="block mx-auto my-1"/>
        <span>Activities</span>
      </NavLink>
      <NavLink to="/profile" className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-white-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }>
        <FontAwesomeIcon icon={faUser}  className="block mx-auto my-1" />
       
        <span>Profile</span>
      </NavLink>
    </div>
  
  );
};

export default Footer;
