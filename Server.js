const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();
const fetch = require('node-fetch');
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
require('dotenv').config();
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render("index.ejs", {
        sendData: {}
    });
});

app.post('/', async (req, res) => {
    try {
        const location = req.body.query;
        console.log("Location received:", location);
        const apiKey = "6K779N9CQP2Q7TUPFKLMU4PGR";
        const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${apiKey}&contentType=json`;
        console.log("API URL:", apiUrl);
        const response = await fetch(apiUrl);
        if (response.ok) {
            const weatherData = await response.json();
            // Now you can do whatever you want with the weather data, e.g., send it as a response or process it further.
            res.json(weatherData);
        } else {
            res.status(response.status).json({
                error: "API request failed"
            });
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({
            error: "Error fetching weather data"
        });
    }
});

app.listen(port, () => {
    console.log("server is up and running on ", port);
});