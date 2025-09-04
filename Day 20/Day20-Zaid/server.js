const express = require("express");
const axios = require("axios");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

// Tomorrow.io weather endpoint
app.get("/weather", async (req, res) => {
  console.log("Request Received");
  const { lat, lon } = req.query;
  if (!lat || !lon)
    return res.status(400).send({ error: "Missing coordinates" });

  try {
    const response = await axios.get("https://api.tomorrow.io/v4/timelines", {
      params: {
        location: `${lat},${lon}`,
        fields: ["temperature", "weatherCode", "humidity", "windSpeed"],
        units: "metric",
        timesteps: "1h",
        apikey: process.env.TOMORROW_API_KEY,
      },
    });

    const weather = response.data.data.timelines[0].intervals[0].values;
    res.send({
      temperature: weather.temperature,
      weatherCode: weather.weatherCode,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
    });
  } catch (err) {
    res
      .status(500)
      .send({ error: "Error fetching weather data", details: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
