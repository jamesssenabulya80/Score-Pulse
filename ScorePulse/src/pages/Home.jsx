import ArticleSidebar from "../components/ArticleSideBar";
import MatchCard from "../components/matchcard";
import Sidebar from "../components/sidebar";

import { useState, useEffect } from "react";

// Calculate the date for Yesterday, Today or Tomorrow
function getFixtureDate(day) {
  // Get today's date according to Uganda's timezone
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kampala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  // Extract the year, month and day
  const dateParts = {};

  parts.forEach((part) => {
    dateParts[part.type] = part.value;
  });

  // Create a date object using the extracted date
  const today = new Date(
    `${dateParts.year}-${dateParts.month}-${dateParts.day}T00:00:00Z`,
  );

  // Determine how many days to move
  const offsets = {
    Yesterday: -1,
    Today: 0,
    Tomorrow: 1,
  };

  // Move the date backward or forward
  today.setUTCDate(today.getUTCDate() + offsets[day]);

  // Return the date in YYYY-MM-DD format
  return today.toISOString().slice(0, 10);
}

// Convert API-Football data into our application's format
function formatFixtures(fixtures) {
  return fixtures.map((fixture) => {
    const statusCode = fixture.fixture.status.short;

    // Identify matches currently in progress
    const liveStatuses = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"];

    const isLive = liveStatuses.includes(statusCode);

    // Convert API date into Today, Yesterday or Tomorrow
    const matchDate = new Date(fixture.fixture.date);
    const today = new Date();

    const dateOnly = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const difference =
      (dateOnly(matchDate) - dateOnly(today)) / (1000 * 60 * 60 * 24);

    let day = "Other";

    if (difference === 0) day = "Today";
    if (difference === -1) day = "Yesterday";
    if (difference === 1) day = "Tomorrow";

    return {
      id: fixture.fixture.id,
      league: fixture.league.name,

      homeTeam: fixture.teams.home.name,
      awayTeam: fixture.teams.away.name,

      homeScore: fixture.goals.home ?? 0,
      awayScore: fixture.goals.away ?? 0,

      status: isLive ? "LIVE" : statusCode,

      minute: fixture.fixture.status.elapsed ?? statusCode,

      day: day,
    };
  });
}

function Home() {
  // React state
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedLeague, setSelectedLeague] = useState("ALL");
  const [selectedDay, setSelectedDay] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");

  // Store raw API fixtures
  const [apiFixtures, setApiFixtures] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch live fixtures from our backend
  // Fetch fixtures for the selected day
  useEffect(() => {
    // Calculate the date for the selected day
    const date = getFixtureDate(selectedDay);

    async function fetchFixtures() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/fixtures?date=${date}`,
        );

        const data = await response.json();

        // Check whether the request was successful
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch fixtures");
        }

        // Store the fixtures
        setApiFixtures(data.response || []);
      } catch (error) {
        console.error("Fixtures fetching error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFixtures();
  }, [selectedDay]);

  // Convert API data into our application's format
  const matches = formatFixtures(apiFixtures);

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    const matchesStatus =
      selectedStatus === "ALL" || match.status === selectedStatus;

    const matchesLeague =
      selectedLeague === "ALL" ||
      match.league.toLowerCase() === selectedLeague.toLowerCase();

    const matchesDay = selectedDay === "ALL" || match.day === selectedDay;

    const search = searchQuery.toLowerCase().trim();

    const matchesSearch =
      match.homeTeam.toLowerCase().includes(search) ||
      match.awayTeam.toLowerCase().includes(search) ||
      match.league.toLowerCase().includes(search);

    return matchesStatus && matchesLeague && matchesDay && matchesSearch;
  });

  return (
    <>
      <div className="app-layout">
        <Sidebar
          selectedLeague={selectedLeague}
          onSelectLeague={setSelectedLeague}
        />

        <main className="main-content">
          <div className="page-heading">
            <div>
              <div className="logo">
                <span>SCORE</span>PULSE
              </div>

              <p>Follow ⚽ from around the world.</p>
            </div>
          </div>

          <div className="day-filter">
            {["Yesterday", "Today", "Tomorrow"].map((day) => (
              <button
                key={day}
                className={`day-btn ${selectedDay === day ? "active" : ""}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search teams or competitions..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="matches-selection">
            <h2>Football Fixtures</h2>

            <div className="matches-list">
              {isLoading ? (
                <p>Loading live matches...</p>
              ) : error ? (
                <p>{error}</p>
              ) : filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <p>No matches found for {selectedDay} .</p>
              )}
            </div>
          </div>
        </main>
        <ArticleSidebar />
      </div>
    </>
  );
}

export default Home;
