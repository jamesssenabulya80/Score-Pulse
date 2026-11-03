import MatchCard from "../components/matchcard";
import Sidebar from "../components/sidebar";
import matches from "../data/matches";

function Home() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-heading">
          <div>
            <h1>Football Scores</h1>
            <p>Follow the action from around the world.</p>
          </div>

          <div className="matches-selection">
            <h2>All Matches</h2>

            <div className="matches-list">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
