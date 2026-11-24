import { useState } from "react";
import { useDemoState } from "../hooks/useDemoState";
import { formatCurrency } from "../utils/formatters";
import { simulateControl, simulateMultipleControls } from "../services/riskEngine";

function SecuritySimulator() {
  const { securityControls, demoSummary } = useDemoState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [result, setResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  function toggleControl(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setResult(null);
  }

  function runSimulation() {
    if (selectedIds.length === 0) return;
    setSimulating(true);
    setTimeout(() => {
      if (selectedIds.length === 1) {
        setResult(simulateControl(selectedIds[0]));
      } else {
        setResult(simulateMultipleControls(selectedIds));
      }
      setSimulating(false);
    }, 800);
  }

  const totalCost = selectedIds.reduce((sum, id) => {
    const ctrl = securityControls.find((c) => c.id === id);
    return sum + (ctrl ? ctrl.cost : 0);
  }, 0);

  return (
    <div className="animate-in">
      <div className="section-heading">
        <h2>Select Security Controls</h2>
        <p>Choose one or more controls to model their potential impact on financial risk before investing.</p>
      </div>

      <div className="control-grid stagger">
        {securityControls.map((ctrl) => {
          const isSelected = selectedIds.includes(ctrl.id);
          return (
            <div
              key={ctrl.id}
              className={`control-card ${isSelected ? "is-selected" : ""}`}
              onClick={() => toggleControl(ctrl.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleControl(ctrl.id); }}
            >
              <div className="control-card-check" aria-hidden="true">
                {isSelected ? "+" : ""}
              </div>
              <p className="control-card-name">{ctrl.name}</p>
              <div className="control-card-meta">
                <span>Cost: <strong>{formatCurrency(ctrl.cost)}</strong></span>
                <span>Impact: <strong>{ctrl.riskReduction}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            {selectedIds.length} control{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <span style={{ fontSize: "0.875rem", fontFamily: "var(--font-mono)" }}>
            Total investment: <strong>{formatCurrency(totalCost)}</strong>
          </span>
          <button
            className="btn btn-primary"
            onClick={runSimulation}
            disabled={simulating}
          >
            {simulating ? (
              <>
                <span className="loading-pulse" /> Simulating...
              </>
            ) : (
              "Simulate"
            )}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => { setSelectedIds([]); setResult(null); }}
          >
            Clear
          </button>
        </div>
      )}

      {result && (
        <div className="result-panel animate-in">
          <div className="card-header">
            <div>
              <h3 className="card-title">Simulation Result</h3>
              <p className="card-subtitle">
                Modeled impact of {selectedIds.length === 1 ? result.controlName || "selected control" : `${selectedIds.length} controls combined`}
              </p>
            </div>
            <span className="status-badge status-badge--success">Simulated</span>
          </div>

          <div className="result-row">
            <div className="result-metric">
              <p className="result-metric-label">Current EAL</p>
              <p className="result-metric-value">{formatCurrency(result.currentEAL)}</p>
            </div>
            <div className="result-arrow">&#8594;</div>
            <div className="result-metric">
              <p className="result-metric-label">New Modeled EAL</p>
              <p className="result-metric-value" style={{ color: "var(--color-success-text)" }}>
                {formatCurrency(result.newEAL || result.newEAL === 0 ? result.newEAL : result.modeledEAL)}
              </p>
            </div>
          </div>

          <div className="result-row" style={{ marginBottom: 0 }}>
            <div className="result-metric">
              <p className="result-metric-label">Modeled Reduction</p>
              <p className="result-metric-value">
                {formatCurrency(result.reductionAmount)}
              </p>
            </div>
            <div className="result-metric">
              <p className="result-metric-label">Risk Reduction</p>
              <p className="result-metric-value">
                {result.reductionPercentage}%
              </p>
            </div>
            <div className="result-metric">
              <p className="result-metric-label">Investment</p>
              <p className="result-metric-value">
                {formatCurrency(result.cost || result.totalCost)}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: "var(--color-surface-muted)", borderRadius: "var(--radius-small)", border: "1px solid var(--color-border)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            The platform models the potential impact of security controls on financial risk before investment decisions are made.
          </div>
        </div>
      )}
    </div>
  );
}

export default SecuritySimulator;
