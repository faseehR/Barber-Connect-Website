import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Card, CardContent, Grid, Tab, Tabs, Avatar, Chip } from '@mui/material';
import { CalendarToday, Person, AccessTime, CheckCircle, Cancel } from '@mui/icons-material';
import axios from '../../services/api';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/appointments/customer/');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    try {
      await axios.delete(`/api/appointments/${id}/`);
      setAppointments(appointments.filter(appt => appt.id !== id));
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  const getStatusChip = (status) => {
    const statusMap = {
      pending: { color: 'warning', label: 'Pending' },
      confirmed: { color: 'success', label: 'Confirmed' },
      completed: { color: 'primary', label: 'Completed' },
      rejected: { color: 'error', label: 'Rejected' },
      cancelled: { color: 'error', label: 'Cancelled' }
    };
    
    const { color, label } = statusMap[status] || { color: 'default', label: status };
    return <Chip label={label} color={color} size="small" />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My Dashboard</Typography>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Appointments" />
        <Tab label="Favorites" />
        <Tab label="Profile" />
      </Tabs>
      
      {activeTab === 0 && (
        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {appointments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" gutterBottom>No appointments yet</Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => window.location.href = '/barbers'}
                    >
                      Find a Barber
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {appointments.map(appointment => (
                      <Grid item xs={12} key={appointment.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar 
                                    src={appointment.barber.user.profile_picture}
                                    sx={{ width: 56, height: 56, mr: 2 }}
                                  />
                                  <Box>
                                    <Typography variant="subtitle1">{appointment.barber.shop_name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {appointment.barber.user.first_name} {appointment.barber.user.last_name}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CalendarToday color="action" sx={{ mr: 1 }} />
                                  <Typography>
                                    {new Date(appointment.date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                  <AccessTime color="action" sx={{ mr: 1 }} />
                                  <Typography>{appointment.time}</Typography>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={3}>
                                <Typography>Service: {appointment.service}</Typography>
                                <Box sx={{ mt: 1 }}>
                                  {getStatusChip(appointment.status)}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={3}>
                                {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => cancelAppointment(appointment.id)}
                                    fullWidth
                                  >
                                    Cancel
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outlined"
                                    onClick={() => window.location.href = `/barber/${appointment.barber.id}`}
                                    fullWidth
                                  >
                                    Book Again
                                  </Button>
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>My Favorite Barbers</Typography>
            {/* Favorite barbers list would go here */}
            <Typography>Coming soon</Typography>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Profile Settings</Typography>
            {/* Profile settings would go here */}
            <Typography>Coming soon</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default CustomerDashboard;