import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Button, Box, Dialog, DialogTitle, DialogContent } from '@mui/material';

function LandingPage() {
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const clothingTypes = ['Shirt', 'Bottoms', 'Dress', 'Jacket', 'Shoes', 'Accessories'];
    const bottomSubtypes = ['shorts', 'skirts', 'jeans'];

    const handleClick = (type) => {
        if (type.toLowerCase() === 'bottoms') {
            setOpenDialog(true);
        } else {
            navigate(`/clothing/${type.toLowerCase()}`);
        }
    }

    const handleSubtypeClick = (subtype) => {
        setOpenDialog(false);
        navigate(`/clothing/bottoms?subtype=${subtype}`);
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Choose Bottom Type</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                        {bottomSubtypes.map((subtype) => (
                            <Grid item key={subtype}>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    onClick={() => handleSubtypeClick(subtype)}
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    {subtype}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default LandingPage;
