import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Get today's date in Uganda
function getUgandaDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kampala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const dateParts = {};

  parts.forEach((part) => {
    dateParts[part.type] = part.value;
  });

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

// Validate date format and actual calendar date
function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
}

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ScorePulse backend is running!",
  });
});

// LIVE FOOTBALL FIXTURES ROUTE
app.get("/api/fixtures/live", async (req, res) => {
  try {
    const apiKey = process.env.FOOTBALL_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Football API key is missing. Check your .env file.",
      });
    }

    // Request currently live fixtures
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        method: "GET",
        headers: {
          "x-apisports-key": apiKey,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(response.status).json({
        error: "Football API request failed.",
        details: errorText,
      });
    }

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(502).json({
        error: "Football API returned an error.",
        details: data.errors,
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Live fixtures error:", error);

    res.status(500).json({
      error: "Something went wrong while retrieving live fixtures.",
    });
  }
});

// DAILY FOOTBALL FIXTURES ROUTE
app.get("/api/fixtures", async (req, res) => {
  try {
    const apiKey = process.env.FOOTBALL_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Football API key is missing. Check your .env file.",
      });
    }

    // Automatically use today's date if no date is provided
    const date = req.query.date || getUgandaDate();

    console.log("Fetching fixtures for:", date);

    // Validate date
    if (!isValidDate(date)) {
      return res.status(400).json({
        error:
          "Invalid date. Use YYYY-MM-DD format with a valid calendar date.",
      });
    }

    // Request ALL fixtures for the selected date
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${date}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": apiKey,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(response.status).json({
        error: "Failed to retrieve fixtures from API-Football.",
        details: errorText,
      });
    }

    const data = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      return res.status(502).json({
        error: "Football API returned an error.",
        details: data.errors,
      });
    }

    // Return all fixtures for the requested date
    res.json(data);
  } catch (error) {
    console.error("Daily fixtures error:", error);

    res.status(500).json({
      error: "Unable to retrieve daily fixtures.",
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`ScorePulse server running on port ${PORT}`);
});
