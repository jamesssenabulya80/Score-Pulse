import MatchCard from "../components/matchcard";
import Sidebar from "../components/sidebar";

import { useState, useEffect } from "react";

// Convert API-Football data into our application's format
function formatFixtures(fixtures) {
  return fixtures.map((fixture) => {
    const statusCode = fixture.fixture.status.short;

    // Identify matches currently in progress
    const liveStatuses = ["1H", "HT", "2H", "ET", "BT", "P"];

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

  // Fetch live fixtures from our backend
  useEffect(() => {
    async function fetchLiveFixtures() {
      try {
        const response = await fetch("http://localhost:5000/api/fixtures/live");

        if (!response.ok) {
          throw new Error("Failed to fetch live fixtures");
        }

        const data = await response.json();

        setApiFixtures(data.response);

        console.log("Live football fixtures:", data.response);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    }

    fetchLiveFixtures();
  }, []);

  // Convert API data into our application's format
  const matches = formatFixtures(apiFixtures);

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    const matchesStatus =
      selectedStatus === "ALL" || match.status === selectedStatus;

    const matchesLeague =
      selectedLeague === "ALL" || match.league === selectedLeague;

    const matchesDay = match.day === selectedDay;

    const matchesSearch =
      match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.league.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesLeague && matchesDay && matchesSearch;
  });

  return (
    <div className="app-layout">
      <Sidebar
        selectedLeague={selectedLeague}
        onSelectLeague={setSelectedLeague}
      />

      <main className="main-content">
        <div className="page-heading">
          <div>
            <h1>Football Scores</h1>
            <p>Follow the action from around the world.</p>
          </div>
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
          <h2>All Matches</h2>

          <div className="matches-list">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}

            {filteredMatches.length === 0 && <p>No matches found.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
