import { useEffect, useState } from "react";

function Sidebar({ selectedLeague, onSelectLeague }) {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH COMPETITIONS FROM OUR BACKEND
  useEffect(() => {
    async function fetchLeagues() {
      try {
        const response = await fetch("http://localhost:5000/api/leagues");

        if (!response.ok) {
          throw new Error("Failed to fetch competitions");
        }

        const data = await response.json();

        // Store all competitions returned by the API
        setLeagues(data);
      } catch (error) {
        console.error("Sidebar competitions error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeagues();
  }, []);

  return (
    <aside className="sidebar">
      {/* SIDEBAR HEADING */}
      <div className="sidebar-heading">
        <h3>COMPETITIONS</h3>
      </div>

      {/* COMPETITION LIST */}
      <div className="league-list">
        <button onClick={() => onSelectLeague("ALL")}></button>

        {/* LOADING STATE */}
        {loading ? (
          <p className="sidebar-message">Loading competitions...</p>
        ) : /* ERROR STATE */
        error ? (
          <p className="sidebar-message">{error}</p>
        ) : /* DISPLAY COMPETITIONS */
        leagues.length > 0 ? (
          leagues.map((item) => {
            const leagueId = item.league.id;
            const leagueName = item.league.name;
            const leagueLogo = item.league.logo;

            return (
              <button
                key={leagueId}
                className={`league-item ${
                  selectedLeague === leagueId ? "active" : ""
                }`}
                onClick={() => onSelectLeague(leagueId)}
              >
                {/* COMPETITION LOGO */}
                <img
                  src={leagueLogo}
                  alt={`${leagueName} logo`}
                  className="league-logo"
                />

                {/* COMPETITION NAME */}
                <span>{leagueName}</span>
              </button>
            );
          })
        ) : (
          /* EMPTY STATE */
          <p className="sidebar-message">No competitions found.</p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
