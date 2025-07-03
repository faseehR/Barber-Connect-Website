import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Button, Container, Grid, Card, CardContent, Typography, Rating, 
  TextField, CircularProgress, Avatar, Divider, Tabs, Tab, Snackbar, Alert 
} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '../../services/api';

const BarberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchBarberDetails = async () => {
      try {
        setLoading(true);
        const [barberResponse, reviewsResponse] = await Promise.all([
          axios.get(`/api/barbers/${id}/`),
          axios.get(`/api/reviews/?barber=${id}`)
        ]);
        
        setBarber(barberResponse.data);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching barber details:', error);
        setSnackbar({ open: true, message: 'Failed to load barber details', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchBarberDetails();
  }, [id]);

  const handleBookAppointment = async () => {
    try {
      await axios.post('/api/appointments/', {
        barber: id,
        date: date.toISOString().split('T')[0],
        time: selectedSlot,
        service: 'Haircut' // Default for demo
      });
      
      setSnackbar({ open: true, message: 'Appointment booked successfully!', severity: 'success' });
      navigate('/customer/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setSnackbar({ open: true, message: 'Failed to book appointment', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!barber) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6">Barber not found</Typography>
      </Container>
    );
  }

  // Generate time slots based on barber's availability
  const generateTimeSlots = () => {
    const slots = [];
    const [startHour, endHour] = [9, 17]; // Default 9am-5pm
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00`);
      if (hour < endHour - 1) {
        slots.push(`${hour}:30`);
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                src={barber.image}
                sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
              />
              <Typography variant="h5">{barber.shopName}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {barber.user.firstName} {barber.user.lastName}
              </Typography>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Rating value={barber.avgRating || 0} precision={0.5} readOnly />
                <Typography sx={{ ml: 1 }}>({barber.reviewCount || 0})</Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Address:</strong> {barber.address}
              </Typography>
              
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Phone:</strong> {barber.user.phone}
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Services</Typography>
              {barber.services.map((service, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>{service.name}</Typography>
                  <Typography>PKR {service.price}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Book Appointment" />
            <Tab label="Reviews" />
          </Tabs>
          
          <Divider sx={{ mb: 3 }} />
          
          {activeTab === 0 ? (
            <Box>
              <Typography variant="h6" gutterBottom>Select Date & Time</Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Calendar
                    onChange={setDate}
                    value={date}
                    minDate={new Date()}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Available Time Slots
                  </Typography>
                  
                  <Grid container spacing={1}>
                    {timeSlots.map(slot => (
                      <Grid item xs={6} sm={4} key={slot}>
                        <Button
                          fullWidth
                          variant={selectedSlot === slot ? 'contained' : 'outlined'}
                          onClick={() => setSelectedSlot(slot)}
                          disabled={false} // Add logic to disable booked slots
                        >
                          {slot}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3 }}
                    disabled={!selectedSlot}
                    onClick={handleBookAppointment}
                  >
                    Book Appointment
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
              
              {reviews.length === 0 ? (
                <Typography>No reviews yet</Typography>
              ) : (
                reviews.map(review => (
                  <Card key={review.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">
                          {review.customer.firstName} {review.customer.lastName}
                        </Typography>
                        <Rating value={review.rating} readOnly />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography>{review.comment}</Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          )}
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BarberDetail;