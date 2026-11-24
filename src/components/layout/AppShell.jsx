import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import DataUpload from "../../pages/DataUpload";
import ExecutiveDashboard from "../../pages/ExecutiveDashboard";
import TechnicalDashboard from "../../pages/TechnicalDashboard";
import Assets from "../../pages/Assets";
import Vulnerabilities from "../../pages/Vulnerabilities";
import MLAnalytics from "../../pages/MLAnalytics";
import FinancialRisk from "../../pages/FinancialRisk";
import SecuritySimulator from "../../pages/SecuritySimulator";
import InvestmentOptimizer from "../../pages/InvestmentOptimizer";
import ScenarioComparison from "../../pages/ScenarioComparison";
import AICopilot from "../../pages/AICopilot";
import DataSources from "../../pages/DataSources";
import Compliance from "../../pages/Compliance";
import AuditLedger from "../../pages/AuditLedger";
import Settings from "../../pages/Settings";

const pageMeta = {
  "/upload": { eyebrow: "Data Ingestion", title: "Data Ingestion & Upload", desc: "Upload and ingest raw internal server logs, vulnerability scans, and business asset inventories for continuous risk quantification and cloud sync." },
  "/": { eyebrow: "Overview", title: "Executive Dashboard", desc: "Continuous cyber risk quantification and investment analysis for AegisBank Technologies." },
  "/technical": { eyebrow: "Overview", title: "Technical Dashboard", desc: "Detailed technical security posture, vulnerability metrics, and asset risk analysis." },
  "/assets": { eyebrow: "Risk Intelligence", title: "Asset Inventory", desc: "Enterprise asset catalog with business criticality, security control status, and financial exposure." },
  "/vulnerabilities": { eyebrow: "Risk Intelligence", title: "Vulnerability Findings", desc: "Vulnerability data with asset-business correlation and risk prioritization." },
  "/ml-analytics": { eyebrow: "Risk Intelligence", title: "ML Risk Analytics", desc: "Machine learning risk prediction with SHAP-style explainable feature contributions." },
  "/financial-risk": { eyebrow: "Risk Intelligence", title: "Financial Risk Quantification", desc: "FAIR-style risk modeling with Monte Carlo simulation for expected annual loss estimation." },
  "/security-simulator": { eyebrow: "Investment", title: "What-If Security Simulator", desc: "Model the potential impact of security controls before investing." },
  "/investment-optimizer": { eyebrow: "Investment", title: "Cybersecurity Investment Optimizer", desc: "Maximize modeled risk reduction within your available cybersecurity budget." },
  "/scenario-comparison": { eyebrow: "Investment", title: "Scenario Comparison", desc: "Compare investment scenarios to visualize the impact of different security strategies." },
  "/ai-copilot": { eyebrow: "Platform", title: "AI Copilot", desc: "Interact with the risk platform through natural language. The AI explains results from the underlying risk and optimization engines." },
  "/data-sources": { eyebrow: "Platform", title: "Security Data Sources", desc: "Connected security data integrations and collection architecture." },
  "/compliance": { eyebrow: "Platform", title: "Compliance Framework Mapping", desc: "Map security controls to industry compliance frameworks." },
  "/audit-ledger": { eyebrow: "Platform", title: "Audit Ledger", desc: "Tamper-evident verification of risk assessment and investment decisions." },
  "/settings": { eyebrow: "Platform", title: "Settings", desc: "Platform controls and enterprise configuration." },
};

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta["/"];

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="main-content">
          <div className="page-container">
            <header className="page-header">
              <div className="page-header-copy">
                <div className="page-eyebrow">
                  {meta.eyebrow}
                </div>
                <h1 className="page-title">
                  {meta.title}
                </h1>
                <p className="page-description">
                  {meta.desc}
                </p>
              </div>

            </header>

            <Routes>
              <Route path="/upload" element={<DataUpload />} />
              <Route path="/" element={<ExecutiveDashboard />} />
              <Route path="/technical" element={<TechnicalDashboard />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/vulnerabilities" element={<Vulnerabilities />} />
              <Route path="/ml-analytics" element={<MLAnalytics />} />
              <Route path="/financial-risk" element={<FinancialRisk />} />
              <Route path="/security-simulator" element={<SecuritySimulator />} />
              <Route path="/investment-optimizer" element={<InvestmentOptimizer />} />
              <Route path="/scenario-comparison" element={<ScenarioComparison />} />
              <Route path="/ai-copilot" element={<AICopilot />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/audit-ledger" element={<AuditLedger />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
