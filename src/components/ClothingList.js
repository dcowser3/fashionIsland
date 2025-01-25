import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, CircularProgress } from '@mui/material';

function ClothingList() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [clothingItems, setClothingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClothingItems = async () => {
            try {
                const response = await fetch(`/api/clothing/${type}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch clothing items');
                }
                const data = await response.json();
                setClothingItems(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchClothingItems();
    }, [type]);

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Box sx={{ my: 4 }}>
                    <Typography color="error" variant="h6">{error}</Typography>
                    <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                        Back to Home
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/')}
                    sx={{ mb: 3 }}
                >
                    Back to Home
                </Button>
                <Typography variant="h4" gutterBottom>
                    {type} Options
                </Typography>
                <Grid container spacing={3}>
                    {clothingItems.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.image_url}
                                    alt={item.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        ${item.price.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}

export default ClothingList;