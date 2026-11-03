function Sidebar() {
  const leagues = [
    "Premier league",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "Champions league",
    "Europa League",
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>COMPETITIONS</h3>

        <ul className="league-list">
          {leagues.map((league) => (
            <li key={league}>
              <span className="league-icon">⚽</span>
              {league}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
