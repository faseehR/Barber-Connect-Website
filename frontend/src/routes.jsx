import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import BarberSearch from './pages/customer/BarberSearch';
import BarberDetail from './pages/customer/BarberDetail';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BarberDashboard from './pages/barber/BarberDashboard';
import PrivateRoute from './services/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/customer" element={<Signup />} />
      <Route path="/signup/barber" element={<Signup />} />
      
      {/* Customer Routes */}
      <Route path="/barbers" element={
        <PrivateRoute allowedRoles={['customer']}>
          <BarberSearch />
        </PrivateRoute>
      } />
      <Route path="/barber/:id" element={
        <PrivateRoute allowedRoles={['customer']}>
          <BarberDetail />
        </PrivateRoute>
      } />
      <Route path="/customer/dashboard" element={
        <PrivateRoute allowedRoles={['customer']}>
          <CustomerDashboard />
        </PrivateRoute>
      } />
      <Route path="/customer/appointments" element={
        <PrivateRoute allowedRoles={['customer']}>
          <CustomerDashboard />
        </PrivateRoute>
      } />
      
      {/* Barber Routes */}
      <Route path="/barber/dashboard" element={
        <PrivateRoute allowedRoles={['barber']}>
          <BarberDashboard />
        </PrivateRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
};

export default AppRoutes;