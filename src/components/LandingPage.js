import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Button, Box } from '@mui/material';

function LandingPage() {
    const navigate = useNavigate();
    const clothingTypes = ['Shirt', 'Pants', 'Dress', 'Jacket', 'Shoes', 'Accessories'];

    const handleClick = (type) => {
        navigate(`/clothing/${type.toLowerCase()}`);
    }

    return (
        <Container>
            <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: '100%', height: '300px', backgroundColor: 'lightgray', mb: 4}}/>
                <Typography variant="h4" gutterBottom>Choose a Clothing Type</Typography>
                <Grid container spacing={2} justifyContent="center">
                    {clothingTypes.map((type) => (
                    <Grid item key={type}>
                        <Button variant="outlined" color="primary" onClick={() => handleClick(type)}>
                            {type}
                        </Button>
                    </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}

export default LandingPage;