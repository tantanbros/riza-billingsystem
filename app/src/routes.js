import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import ComplaintsView from 'src/views/complaints/ComplaintsView';
import BuildInvoiceView from 'src/views/invoice/BuildInvoiceView';
import InvoicesView from 'src/views/invoice/InvoicesView';
import CustomerBillsView from 'src/views/invoice/CustomerBillsView';
import LogoutView from 'src/views/auth/LogoutView';
import PrivateRoute from 'src/components/PrivateRoute';
import { Role } from 'src/helpers/constants';
import RegisterAuthorizedView from 'src/views/auth/RegisterAuthorizedView';
import LandingPage from 'src/views/landing/LandingPage';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '/', element: <LandingPage /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'complaints',
        element: (
          <PrivateRoute role={Role.PortAuthority}>
            <ComplaintsView />
          </PrivateRoute>
        )
      },
      {
        path: 'invoice',
        element: (
          <PrivateRoute role={Role.PortAuthority}>
            <BuildInvoiceView />
          </PrivateRoute>
        )
      },
      {
        path: 'portauthority',
        element: (
          <PrivateRoute role={Role.PortAuthority}>
            <InvoicesView />
          </PrivateRoute>
        )
      },
      {
        path: 'registerauthorized',
        element: (
          <PrivateRoute role={Role.PortAuthority}>
            <RegisterAuthorizedView />
          </PrivateRoute>
        )
      },
      {
        path: 'customer',
        element: (
          <PrivateRoute role={Role.Customer}>
            <CustomerBillsView />
          </PrivateRoute>
        )
      },
      { path: 'profile', element: <AccountView /> },
      { path: 'logout', element: <LogoutView /> }
    ]
  }
];

export default routes;
