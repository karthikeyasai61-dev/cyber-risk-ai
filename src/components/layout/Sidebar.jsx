import { NavLink } from "react-router-dom";

const navigationGroups = [
  {
    label: "Data Ingestion",
    items: [
      {
        label: "Data Ingestion & Upload",
        path: "/upload",
        icon: "01",
      },
    ],
  },
  {
    label: "Overview",
    items: [
      {
        label: "Executive Dashboard",
        path: "/",
        icon: "02",
      },
      {
        label: "Technical Dashboard",
        path: "/technical",
        icon: "03",
      },
    ],
  },
  {
    label: "Risk Intelligence",
    items: [
      {
        label: "Assets",
        path: "/assets",
        icon: "04",
      },
      {
        label: "Vulnerabilities",
        path: "/vulnerabilities",
        icon: "05",
      },
      {
        label: "ML Risk Analytics",
        path: "/ml-analytics",
        icon: "06",
      },
      {
        label: "Financial Risk",
        path: "/financial-risk",
        icon: "07",
      },
    ],
  },
  {
    label: "Investment",
    items: [
      {
        label: "Security Simulator",
        path: "/security-simulator",
        icon: "08",
      },
      {
        label: "Investment Optimizer",
        path: "/investment-optimizer",
        icon: "09",
      },
      {
        label: "Scenario Comparison",
        path: "/scenario-comparison",
        icon: "10",
      },
    ],
  },
  {
    label: "Platform",
    items: [
      {
        label: "AI Copilot",
        path: "/ai-copilot",
        icon: "11",
      },
      {
        label: "Data Sources",
        path: "/data-sources",
        icon: "12",
      },
      {
        label: "Compliance",
        path: "/compliance",
        icon: "13",
      },
      {
        label: "Audit Ledger",
        path: "/audit-ledger",
        icon: "14",
      },
      {
        label: "Settings",
        path: "/settings",
        icon: "15",
      },
    ],
  },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`app-sidebar ${isOpen ? "is-open" : ""}`}
        aria-label="Primary navigation"
      >
        <div className="sidebar-inner">
          <div className="brand-block">
            <div className="brand-mark" aria-hidden="true">
              CR
            </div>

            <div>
              <p className="brand-name">
                CyberRisk AI
              </p>

              <p className="brand-subtitle">
                Risk Intelligence
              </p>
            </div>
          </div>

          <nav className="sidebar-navigation">
            {navigationGroups.map((group) => (
              <section
                className="navigation-section"
                key={group.label}
              >
                <div className="navigation-label">
                  {group.label}
                </div>

                <ul className="navigation-list">
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                          `navigation-link ${
                            isActive ? "is-active" : ""
                          }`
                        }
                        onClick={onClose}
                      >
                        <span
                          className="navigation-icon"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>

                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="demo-indicator" style={{ background: "var(--color-surface-muted)", borderColor: "var(--color-border)" }}>
              <div className="demo-indicator-copy">
                <p className="demo-indicator-title" style={{ color: "var(--color-text-secondary)" }}>
                  AegisBank Technologies
                </p>

                <p className="demo-indicator-text">
                  Enterprise Risk Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
