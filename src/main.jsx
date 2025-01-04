import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import Friends from './components/Friends/Friends.jsx';
import Layout from './Layout.jsx';
import Groups from './components/Groups/Groups.jsx';
import Activities from './components/Activities/Activities.jsx';
import Profile from './components/Profile/Profile.jsx';
import AuthPage from './components/AuthPage/authpage.jsx';
import { Provider } from 'react-redux';
import store from '../Auth/store.js';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx';
import GroupDetailPage from './components/GroupDetails/GroupDetailPage.jsx';
import FriendDetailPage from './components/Friends/FriendDetailPage.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<AuthPage />} />
      <Route
        path='profile'
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path='friends'
        element={
          <PrivateRoute>
            <Friends />
          </PrivateRoute>
        }
      />
      <Route
        path='friend/:id'
        element={
          <PrivateRoute>
            <FriendDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path='activities'
        element={
          <PrivateRoute>
            <Activities />
          </PrivateRoute>
        }
      />
      <Route
        path='groups'
        element={
          <PrivateRoute>
            <Groups />
          </PrivateRoute>
        }
      />
       <Route
        path='groups/:id'
        element={
          <PrivateRoute>
            <GroupDetailPage />
          </PrivateRoute>
        }
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
