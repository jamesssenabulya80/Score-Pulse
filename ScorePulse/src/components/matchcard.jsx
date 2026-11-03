function MatchCard({ match }) {
  return (
    <div className="match-card">
      <div className="match-league">{match.league}</div>

      <div className="match-teams">
        <div className="team">
          <span>{match.homeTeam}</span>
          <strong>{match.homeScore}</strong>
        </div>

        <div className="team">
          <span>{match.awayTeam}</span>
          <strong>{match.awayScore}</strong>
        </div>
      </div>

      <div className={`match-status ${match.status.toLowerCase()}`}>
        {match.status === "LIVE" ? match.minute : match.status}
      </div>
    </div>
  );
}

export default MatchCard;
