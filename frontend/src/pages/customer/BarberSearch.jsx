import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Card, CardContent, Typography, Rating, TextField, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from '../../services/api';

const BarberSearch = () => {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoading(true);
        let url = '/api/barbers/';
        const params = {};
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        if (location) {
          params.lat = location.lat;
          params.lng = location.lng;
        }
        
        const response = await axios.get(url, { params });
        setBarbers(response.data);
      } catch (error) {
        console.error('Error fetching barbers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, [searchTerm, location]);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <TextField
          label="Search barbers"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '60%' }}
        />
        <Button
          variant="outlined"
          startIcon={<LocationOnIcon />}
          onClick={handleLocationClick}
        >
          {location ? 'Near Me' : 'Use My Location'}
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {barbers.map((barber) => (
            <Grid item xs={12} sm={6} md={4} key={barber.id}>
              <Card 
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => navigate(`/barber/${barber.id}`)}
              >
                <Box
                  component="img"
                  src={barber.image || '/default-barber.jpg'}
                  alt={barber.shopName}
                  sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {barber.shopName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={barber.avgRating || 0} precision={0.5} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({barber.reviewCount || 0} reviews)
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {barber.address}
                  </Typography>
                  <Typography variant="body2">
                    Services: {barber.services.map(s => s.name).join(', ')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BarberSearch;