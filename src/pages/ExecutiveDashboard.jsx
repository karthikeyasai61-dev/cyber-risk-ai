import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { useDemoState } from "../hooks/useDemoState";
import { formatCurrency, formatNumber } from "../utils/formatters";

const COLORS = ["#111", "#444", "#777", "#999", "#bbb"];

function ExecutiveDashboard() {
  const {
    demoSummary, assets, riskDrivers, financialRiskContributions,
    riskTrend, optimizedInvestment,
  } = useDemoState();

  const topAssets = assets.slice(0, 5).map((a) => ({
    name: a.name,
    exposure: a.financialExposure / 100000,
  }));

  return (
    <div className="animate-in">
      {/* Stat Cards */}
      <div className="stat-cards stagger">
        <div className="stat-card">
          <div className="stat-card-accent stat-card-accent--danger" />
          <p className="stat-card-label">Overall Risk</p>
          <p className="stat-card-value stat-card-value--danger">{demoSummary.overallRisk}</p>
          <p className="stat-card-sub">Modeled risk assessment</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent stat-card-accent--warning" />
          <p className="stat-card-label">Current EAL</p>
          <p className="stat-card-value">{formatCurrency(demoSummary.currentEAL)}</p>
          <p className="stat-card-sub">Modeled Expected Annual Loss</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent stat-card-accent--danger" />
          <p className="stat-card-label">Critical Findings</p>
          <p className="stat-card-value stat-card-value--danger">{demoSummary.criticalFindings}</p>
          <p className="stat-card-sub">Unresolved critical vulnerabilities</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent stat-card-accent--info" />
          <p className="stat-card-label">Available Budget</p>
          <p className="stat-card-value">{formatCurrency(demoSummary.availableBudget)}</p>
          <p className="stat-card-sub">Cybersecurity investment</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-grid">
        {/* Financial Risk Distribution */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Financial Risk Distribution</h3>
              <p className="card-subtitle">Risk contribution by business area</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={financialRiskContributions}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="percentage"
                nameKey="name"
                stroke="none"
              >
                {financialRiskContributions.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => `${v}%`}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #eaeaea",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Risk Assets */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Top Risk Assets</h3>
              <p className="card-subtitle">Financial exposure in ₹ Lakhs</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topAssets} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip
                formatter={(v) => `₹${v.toFixed(1)}L`}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #eaeaea",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="exposure" fill="#111" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Trend */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Risk Trend</h3>
              <p className="card-subtitle">Quarterly risk score trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={riskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 85]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #eaeaea",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#111"
                strokeWidth={2}
                dot={{ fill: "#111", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Drivers */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Risk Drivers</h3>
              <p className="card-subtitle">SHAP-style contribution weights</p>
            </div>
          </div>
          {riskDrivers.map((d) => (
            <div className="shap-bar-row" key={d.name}>
              <span className="shap-bar-label">{d.name}</span>
              <div className="shap-bar-track">
                <div
                  className="shap-bar-fill"
                  style={{ width: `${d.contribution * 10}%` }}
                />
              </div>
              <span className="shap-bar-value">{d.contribution}/10</span>
            </div>
          ))}
        </div>

        {/* Investment Recommendation */}
        <div className="dashboard-card dashboard-card--full">
          <div className="card-header">
            <div>
              <h3 className="card-title">Investment Recommendation</h3>
              <p className="card-subtitle">Optimized ₹50L budget allocation for maximum modeled risk reduction</p>
            </div>
            <span className="status-badge status-badge--success">Optimized</span>
          </div>

          <div className="result-row">
            <div className="result-metric">
              <p className="result-metric-label">Current EAL</p>
              <p className="result-metric-value">{formatCurrency(optimizedInvestment.currentEAL)}</p>
            </div>
            <div className="result-arrow">→</div>
            <div className="result-metric">
              <p className="result-metric-label">Optimized EAL</p>
              <p className="result-metric-value" style={{ color: "var(--color-success-text)" }}>
                {formatCurrency(optimizedInvestment.optimizedEAL)}
              </p>
            </div>
            <div className="result-metric">
              <p className="result-metric-label">Risk Reduction</p>
              <p className="result-metric-value">{optimizedInvestment.reductionPercentage}%</p>
            </div>
          </div>

          <div className="allocation-bar">
            {optimizedInvestment.controls.map((c, i) => (
              <div
                key={i}
                className="allocation-segment"
                style={{ width: `${(c.investment / optimizedInvestment.budget) * 100}%` }}
                title={`${c.name}: ${formatCurrency(c.investment)}`}
              >
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveDashboard;
