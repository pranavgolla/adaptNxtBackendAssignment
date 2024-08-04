const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const WEATHER_API_KEY = 'd885aa1d783fd13a55050afeef620fcb'; // Replace with your API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Endpoint to get weather by city name
app.get('/weather', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await axios.get(`${WEATHER_API_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
    const { main, weather } = response.data;

    res.json({
      city: city,
      temperature: main.temp,
      description: weather[0].description
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Endpoint to get weather by user's IP-based location
app.get('/current-location-weather', async (req, res) => {
  try {
    // Use a third-party service to get the user's location from their IP address
    const locationResponse = await axios.get('https://ipapi.co/json/');
    const { city } = locationResponse.data;

    if (!city) {
      return res.status(400).json({ error: 'Unable to determine location' });
    }

    const weatherResponse = await axios.get(`${WEATHER_API_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
    const { main, weather } = weatherResponse.data;

    res.json({
      city: city,
      temperature: main.temp,
      description: weather[0].description
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
