import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    Box, 
    Button, 
    CircularProgress,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Chip
} from '@mui/material';

function ClothingList() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const subtype = searchParams.get('subtype');
    const [clothingItems, setClothingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableSites, setAvailableSites] = useState({});
    const [selectedSources, setSelectedSources] = useState(new Set(['manual']));

    // Fetch available sites and their categories
    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await fetch('/api/sites');
                if (!response.ok) {
                    throw new Error('Failed to fetch available sites');
                }
                const data = await response.json();
                setAvailableSites(data);
                // Initialize selected sources with all available sites
                setSelectedSources(new Set(['manual', ...Object.keys(data)]));
            } catch (err) {
                console.error('Error fetching sites:', err);
            }
        };

        fetchSites();
    }, []);

    // Fetch clothing items from all selected sources
    useEffect(() => {
        const fetchClothingItems = async () => {
            try {
                setLoading(true);
                setError(null);

                const fetchPromises = [];
                
                // Fetch local items if selected
                if (selectedSources.has('manual')) {
                    const url = type === 'bottoms' && subtype
                        ? `/api/clothing/${type}?subtype=${subtype}`
                        : `/api/clothing/${type}`;
                    fetchPromises.push(
                        fetch(url)
                            .then(res => res.ok ? res.json() : [])
                    );
                }

                // Fetch items from each selected external source
                for (const site of selectedSources) {
                    if (site !== 'manual' && availableSites[site]?.includes(type)) {
                        fetchPromises.push(
                            fetch(`/api/scrape/${site}/${type}`)
                                .then(res => res.ok ? res.json() : [])
                                .catch(() => [])
                        );
                    }
                }

                const results = await Promise.all(fetchPromises);
                const combinedData = results
                    .flat()
                    .sort((a, b) => a.price - b.price);

                setClothingItems(combinedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (selectedSources.size > 0) {
            fetchClothingItems();
        }
    }, [type, subtype, selectedSources, availableSites]);

    const handleSourceToggle = (source) => {
        const newSelected = new Set(selectedSources);
        if (newSelected.has(source)) {
            newSelected.delete(source);
        } else {
            newSelected.add(source);
        }
        setSelectedSources(newSelected);
    };

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
                    {type === 'bottoms' && subtype 
                        ? `${subtype.charAt(0).toUpperCase() + subtype.slice(1)}`
                        : `${type.charAt(0).toUpperCase() + type.slice(1)}`} Options
                </Typography>

                {/* Source filters */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Filter by Source
                    </Typography>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedSources.has('manual')}
                                    onChange={() => handleSourceToggle('manual')}
                                />
                            }
                            label="Local Items"
                        />
                        {Object.keys(availableSites).map(site => (
                            <FormControlLabel
                                key={site}
                                control={
                                    <Checkbox
                                        checked={selectedSources.has(site)}
                                        onChange={() => handleSourceToggle(site)}
                                    />
                                }
                                label={site.charAt(0).toUpperCase() + site.slice(1)}
                            />
                        ))}
                    </FormGroup>
                </Box>

                <Grid container spacing={3}>
                    {clothingItems.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.id || `${item.source}-${item.name}`}>
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
                                        ${parseFloat(item.price).toFixed(2)}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Chip 
                                            label={item.source === 'manual' ? 'Local' : item.source}
                                            size="small"
                                            color={item.source === 'manual' ? 'primary' : 'secondary'}
                                        />
                                    </Box>
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
