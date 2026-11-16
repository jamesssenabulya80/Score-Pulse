import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "LiveScore backend is running!",
  });
});

// LIVE FOOTBALL FIXTURES ROUTE
app.get("/api/fixtures/live", async (req, res) => {
  try {
    // 1. Check whether our API key exists
    const apiKey = process.env.FOOTBALL_API_KEY;

    if (!apiKey === "84eb7ef6b1031c5b9e3bd33d040cde54") {
      return res.status(500).json({
        error: "Football API key is missing. Check your .env file.",
      });
    }

    // 2. Request live fixtures from API-Football
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        method: "GET",
        headers: {
          "x-apisports-key": apiKey,
        },
      },
    );

    // 3. Check whether the external API responded successfully
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Football API request failed.",
        status: response.status,
      });
    }

    // 4. Convert the API response into JavaScript data
    const data = await response.json();

    // 5. Check for API-Football errors
    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(502).json({
        error: "Football API returned an error.",
        details: data.errors,
      });
    }

    // 6. Send the fixtures to whoever requested them
    res.json(data);
  } catch (error) {
    console.error("Live fixtures error:", error);

    res.status(500).json({
      error: "Something went wrong while retrieving live fixtures.",
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
