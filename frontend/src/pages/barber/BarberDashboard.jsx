import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Card, CardContent, Grid, Tab, Tabs } from '@mui/material';
import axios from '../../services/api';

const BarberDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    earnings: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appointmentsResponse, statsResponse] = await Promise.all([
          axios.get('/api/appointments/barber/'),
          axios.get('/api/barbers/stats/')
        ]);
        
        setAppointments(appointmentsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAppointmentAction = async (id, action) => {
    try {
      await axios.patch(`/api/appointments/${id}/`, { action });
      setAppointments(appointments.map(appt => 
        appt.id === id ? { ...appt, status: action === 'accept' ? 'confirmed' : 'rejected' } : appt
      ));
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Barber Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Total Appointments</Typography>
              <Typography variant="h3">{stats.totalAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Upcoming</Typography>
              <Typography variant="h3">{stats.upcomingAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary">Earnings</Typography>
              <Typography variant="h3">PKR {stats.earnings}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Appointments" />
        <Tab label="Availability" />
        <Tab label="Profile" />
      </Tabs>
      
      <Box sx={{ mt: 3 }}>
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
                    <Typography>No appointments yet</Typography>
                  ) : (
                    appointments.map(appointment => (
                      <Box key={appointment.id} sx={{ 
                        p: 2, 
                        mb: 2, 
                        border: '1px solid #eee', 
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Box>
                          <Typography variant="subtitle1">
                            {appointment.customer.firstName} {appointment.customer.lastName}
                          </Typography>
                          <Typography variant="body2">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </Typography>
                          <Typography variant="body2">Service: {appointment.service}</Typography>
                          <Typography variant="body2">Status: {appointment.status}</Typography>
                        </Box>
                        
                        {appointment.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              variant="contained" 
                              color="success"
                              onClick={() => handleAppointmentAction(appointment.id, 'accept')}
                            >
                              Accept
                            </Button>
                            <Button 
                              variant="outlined" 
                              color="error"
                              onClick={() => handleAppointmentAction(appointment.id, 'reject')}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        )}
        
        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Set Your Availability</Typography>
              {/* Availability settings would go here */}
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
      </Box>
    </Container>
  );
};

export default BarberDashboard;