function Topbar({ onMenuClick }) {
  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <span aria-hidden="true">☰</span>
        </button>

        <div>
          <div
            style={{
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Enterprise Risk Platform
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <span className="status-badge status-badge--success">
          Connected
        </span>
      </div>
    </header>
  );
}

export default Topbar;
