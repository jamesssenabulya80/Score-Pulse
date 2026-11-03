function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <span>SCORE</span>PULSE
      </div>

      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/leagues">Leagues</a>
        <a href="/matches">Matches</a>
      </nav>

      <div className="nav-actions">
        <button>Sign In</button>
      </div>
    </header>
  );
}

export default Navbar;
