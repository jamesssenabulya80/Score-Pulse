import MatchCard from "../components/matchcard";
import Sidebar from "../components/sidebar";
import matches from "../data/matches";
import { useState } from "react";

function Home() {
  //state
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedLeague, setSelectedLeague] = useState("ALL");
  const [selectedDay, setSelectedDay] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");

  //Match filter
  const filteredMatches = matches.filter((match) => {
    const matchesStatus =
      selectedStatus === "ALL" || match.status === selectedStatus;

    const matchesLeague =
      selectedLeague === "ALL" || match.league === selectedLeague;

    const matchesDay = match.day == selectedDay;

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
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
