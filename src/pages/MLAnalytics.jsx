import { useState, useEffect } from "react";
import { useDemoState } from "../hooks/useDemoState";

function MLAnalytics() {
  const { mlRiskAnalytics, riskDrivers } = useDemoState();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="animate-in">
      {/* ML Prediction Card */}
      <div className="dashboard-grid" style={{ marginBottom: 32 }}>
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">ML Risk Prediction</h3>
              <p className="card-subtitle">{mlRiskAnalytics.model}</p>
            </div>
            <span className="status-badge status-badge--info">ML Model</span>
          </div>

          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              margin: "0 0 8px",
            }}>
              Asset: {mlRiskAnalytics.asset}
            </p>

            <p style={{
              fontFamily: "var(--font-serif)",
              fontSize: "3rem",
              fontWeight: 500,
              color: "var(--color-danger-text)",
              margin: "0 0 8px",
              letterSpacing: "-0.03em",
            }}>
              {mlRiskAnalytics.prediction}
            </p>

            <p style={{
              color: "var(--color-text-muted)",
              fontSize: "0.8125rem",
              margin: 0,
            }}>
              Confidence: {mlRiskAnalytics.confidence}
            </p>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Model Information</h3>
              <p className="card-subtitle">Architecture and methodology</p>
            </div>
          </div>

          <div style={{ fontSize: "0.8125rem", lineHeight: 1.8 }}>
            <div className="correlation-field">
              <span className="correlation-field-label">Model</span>
              <strong>{mlRiskAnalytics.model}</strong>
            </div>
            <div className="correlation-field">
              <span className="correlation-field-label">Explanation Method</span>
              <strong>{mlRiskAnalytics.explanationMethod}</strong>
            </div>
            <div className="correlation-field">
              <span className="correlation-field-label">Target Asset</span>
              <strong>{mlRiskAnalytics.asset}</strong>
            </div>
            <div className="correlation-field">
              <span className="correlation-field-label">Prediction</span>
              <span className="status-badge status-badge--danger">{mlRiskAnalytics.prediction}</span>
            </div>
          </div>

          <div className="correlation-insight" style={{ marginTop: 16 }}>
            ML analyzes structured security information and identifies important risk-related patterns and drivers.
          </div>
        </div>
      </div>

      {/* SHAP Feature Contributions */}
      <div className="dashboard-card" style={{ marginBottom: 32 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Risk Drivers — SHAP-Style Feature Contributions</h3>
            <p className="card-subtitle">Explainable ML: which features drive the High risk prediction</p>
          </div>
        </div>

        <div style={{ padding: "16px 0" }}>
          {riskDrivers.map((d) => (
            <div className="shap-bar-row" key={d.name}>
              <span className="shap-bar-label">{d.name}</span>
              <div className="shap-bar-track">
                <div
                  className="shap-bar-fill"
                  style={{ width: animated ? `${d.contribution * 10}%` : "0%" }}
                />
              </div>
              <span className="shap-bar-value">{d.contribution}/10</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">What This Means</h3>
          </div>
        </div>
        <div style={{ fontSize: "0.875rem", lineHeight: 1.8, maxWidth: 720 }}>
          <p>
            The ML model evaluates multiple security dimensions for each asset and produces a
            risk classification. The SHAP-style feature contributions show <strong>why</strong> the
            model predicts a particular risk level — making the analysis explainable and auditable.
          </p>
          <p style={{ margin: "12px 0 0" }}>
            For the <strong>Payment Database</strong>, the top drivers are:
          </p>
          <ol style={{ margin: "8px 0", paddingLeft: 20 }}>
            <li><strong>Asset Criticality</strong> — processes all financial transactions</li>
            <li><strong>Internet Exposure</strong> — accessible from external networks</li>
            <li><strong>Critical Vulnerabilities</strong> — unpatched critical CVEs</li>
          </ol>
          <p style={{ margin: "12px 0 0", color: "var(--color-text-muted)", fontStyle: "italic" }}>
            ML identifies risk patterns across structured security data, and SHAP provides full explainability of each prediction.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MLAnalytics;
