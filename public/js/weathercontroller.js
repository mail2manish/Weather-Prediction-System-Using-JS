const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

// Defining a route handler for fetching weather data by city name
router.get('/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const apiKey = '865e7b0bf0msh7995f9f75b83965p1ecf1djsnb1b07759c121'; 
    const apiUrl = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error('Weather data not found');
    }

    const weatherData = await response.json();
    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching weather data.' });
  }
});

module.exports = router;
