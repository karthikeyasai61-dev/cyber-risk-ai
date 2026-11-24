export const demoEnterprise = {
  name: "AegisBank Technologies Pvt. Ltd.",
  industry: "Financial Services",
  environment: "Production",
  dataType: "Enterprise Data",
  lastSynchronized: "2026-09-21 11:42",
};

export const demoSummary = {
  overallRisk: "High",
  currentEAL: 7240000,
  criticalFindings: 12,
  availableBudget: 5000000,
  totalAssets: 107,
  vulnerabilities: 86,
  criticalVulnerabilities: 12,
  threats: 18,
  securityControls: 7,
};

export const assets = [
  {
    id: "AST-001",
    name: "Payment Gateway",
    type: "Application Server",
    businessCriticality: "Critical",
    dataSensitivity: "Highly Sensitive",
    internetExposure: "Internet",
    vulnerabilityCount: 14,
    criticalVulnerabilityCount: 3,
    securityControlStatus: "Partial",
    currentRisk: "Very High",
    financialExposure: 1980000,
  },
  {
    id: "AST-002",
    name: "Customer Database",
    type: "Database",
    businessCriticality: "Critical",
    dataSensitivity: "Highly Sensitive",
    internetExposure: "Internal",
    vulnerabilityCount: 11,
    criticalVulnerabilityCount: 2,
    securityControlStatus: "Partial",
    currentRisk: "High",
    financialExposure: 1640000,
  },
  {
    id: "AST-003",
    name: "Internet Banking Server",
    type: "Application Server",
    businessCriticality: "Critical",
    dataSensitivity: "Sensitive",
    internetExposure: "Internet",
    vulnerabilityCount: 9,
    criticalVulnerabilityCount: 2,
    securityControlStatus: "Good",
    currentRisk: "High",
    financialExposure: 1260000,
  },
  {
    id: "AST-004",
    name: "Identity Server",
    type: "Identity Infrastructure",
    businessCriticality: "Critical",
    dataSensitivity: "Highly Sensitive",
    internetExposure: "Internal",
    vulnerabilityCount: 8,
    criticalVulnerabilityCount: 2,
    securityControlStatus: "Weak",
    currentRisk: "High",
    financialExposure: 1110000,
  },
  {
    id: "AST-005",
    name: "Cloud Storage",
    type: "Cloud Resource",
    businessCriticality: "High",
    dataSensitivity: "Sensitive",
    internetExposure: "Internet",
    vulnerabilityCount: 7,
    criticalVulnerabilityCount: 1,
    securityControlStatus: "Good",
    currentRisk: "Medium",
    financialExposure: 740000,
  },
  {
    id: "AST-006",
    name: "Employee Portal",
    type: "Web Application",
    businessCriticality: "High",
    dataSensitivity: "Internal",
    internetExposure: "Internet",
    vulnerabilityCount: 6,
    criticalVulnerabilityCount: 1,
    securityControlStatus: "Partial",
    currentRisk: "Medium",
    financialExposure: 510000,
  },
  {
    id: "AST-007",
    name: "Transaction API",
    type: "API Service",
    businessCriticality: "Critical",
    dataSensitivity: "Highly Sensitive",
    internetExposure: "Internet",
    vulnerabilityCount: 8,
    criticalVulnerabilityCount: 1,
    securityControlStatus: "Partial",
    currentRisk: "High",
    financialExposure: 920000,
  },
  {
    id: "AST-008",
    name: "Backup Server",
    type: "Infrastructure Server",
    businessCriticality: "High",
    dataSensitivity: "Sensitive",
    internetExposure: "Internal",
    vulnerabilityCount: 5,
    criticalVulnerabilityCount: 0,
    securityControlStatus: "Good",
    currentRisk: "Medium",
    financialExposure: 380000,
  },
];

export const vulnerabilities = [
  {
    id: "VUL-001",
    cve: "DEMO-CVE-2026-001",
    asset: "Payment Gateway",
    cvss: 9.8,
    status: "Unpatched",
    exposure: "Internet",
    severity: "Critical",
  },
  {
    id: "VUL-002",
    cve: "DEMO-CVE-2026-002",
    asset: "Customer Database",
    cvss: 8.8,
    status: "Unpatched",
    exposure: "Internal",
    severity: "High",
  },
  {
    id: "VUL-003",
    cve: "DEMO-CVE-2026-003",
    asset: "Employee Portal",
    cvss: 7.5,
    status: "Open",
    exposure: "Internet",
    severity: "High",
  },
  {
    id: "VUL-004",
    cve: "DEMO-CVE-2026-004",
    asset: "Transaction API",
    cvss: 9.1,
    status: "Open",
    exposure: "Internet",
    severity: "Critical",
  },
  {
    id: "VUL-005",
    cve: "DEMO-CVE-2026-005",
    asset: "Identity Server",
    cvss: 8.9,
    status: "Open",
    exposure: "Internal",
    severity: "High",
  },
  {
    id: "VUL-006",
    cve: "DEMO-CVE-2026-006",
    asset: "Cloud Storage",
    cvss: 7.8,
    status: "Monitoring",
    exposure: "Internet",
    severity: "High",
  },
];

export const dataSources = [
  {
    id: "SRC-001",
    name: "Vulnerability Scanner",
    type: "Security Findings",
    status: "Connected",
    records: 1284,
  },
  {
    id: "SRC-002",
    name: "SIEM",
    type: "Security Events",
    status: "Connected",
    records: 24617,
  },
  {
    id: "SRC-003",
    name: "IAM",
    type: "Identity Events",
    status: "Connected",
    records: 3892,
  },
  {
    id: "SRC-004",
    name: "EDR",
    type: "Endpoint Security",
    status: "Connected",
    records: 8431,
  },
  {
    id: "SRC-005",
    name: "CSPM",
    type: "Cloud Security",
    status: "Connected",
    records: 672,
  },
  {
    id: "SRC-006",
    name: "Asset Inventory",
    type: "Asset Metadata",
    status: "Connected",
    records: 107,
  },
  {
    id: "SRC-007",
    name: "Threat Intelligence",
    type: "Threat Context",
    status: "Connected",
    records: 2148,
  },
];

export const riskDrivers = [
  {
    name: "Asset Criticality",
    contribution: 10,
  },
  {
    name: "Internet Exposure",
    contribution: 8,
  },
  {
    name: "Critical Vulnerabilities",
    contribution: 7,
  },
  {
    name: "Patch Compliance",
    contribution: 6,
  },
  {
    name: "Control Effectiveness",
    contribution: 5,
  },
  {
    name: "Threat Activity",
    contribution: 4,
  },
];

export const financialRiskContributions = [
  {
    name: "Payment Infrastructure",
    percentage: 31,
  },
  {
    name: "Customer Data",
    percentage: 24,
  },
  {
    name: "Identity Infrastructure",
    percentage: 18,
  },
  {
    name: "Cloud Exposure",
    percentage: 15,
  },
  {
    name: "Other",
    percentage: 12,
  },
];

export const monteCarloSummary = {
  simulations: 10000,
  expectedAnnualLoss: 7240000,
  medianLoss: 6180000,
  percentile90: 13500000,
};

export const monteCarloDistribution = [
  { range: "0-20L", frequency: 1420 },
  { range: "20-40L", frequency: 2080 },
  { range: "40-60L", frequency: 2240 },
  { range: "60-80L", frequency: 1710 },
  { range: "80-100L", frequency: 1120 },
  { range: "100-120L", frequency: 720 },
  { range: "120-140L", frequency: 420 },
  { range: "140L+", frequency: 290 },
];

export const securityControls = [
  {
    id: "CTRL-001",
    name: "Multi-Factor Authentication",
    shortName: "MFA",
    cost: 800000,
    riskReduction: "High",
    modeledEAL: 5970000,
    reductionAmount: 1270000,
    reductionPercentage: 17.5,
  },
  {
    id: "CTRL-002",
    name: "EDR Expansion",
    shortName: "EDR",
    cost: 1500000,
    riskReduction: "High",
    modeledEAL: 5400000,
    reductionAmount: 1840000,
    reductionPercentage: 25.4,
  },
  {
    id: "CTRL-003",
    name: "Network Segmentation",
    shortName: "Segmentation",
    cost: 1800000,
    riskReduction: "High",
    modeledEAL: 5520000,
    reductionAmount: 1720000,
    reductionPercentage: 23.8,
  },
  {
    id: "CTRL-004",
    name: "Backup Improvement",
    shortName: "Backup",
    cost: 1000000,
    riskReduction: "Medium",
    modeledEAL: 6360000,
    reductionAmount: 880000,
    reductionPercentage: 12.2,
  },
  {
    id: "CTRL-005",
    name: "Patch Automation",
    shortName: "Patch",
    cost: 700000,
    riskReduction: "Medium",
    modeledEAL: 6500000,
    reductionAmount: 740000,
    reductionPercentage: 10.2,
  },
  {
    id: "CTRL-006",
    name: "Web Application Firewall",
    shortName: "WAF",
    cost: 900000,
    riskReduction: "Medium",
    modeledEAL: 6420000,
    reductionAmount: 820000,
    reductionPercentage: 11.3,
  },
  {
    id: "CTRL-007",
    name: "Employee Security Training",
    shortName: "Training",
    cost: 500000,
    riskReduction: "Low/Medium",
    modeledEAL: 6810000,
    reductionAmount: 430000,
    reductionPercentage: 5.9,
  },
];

export const optimizedInvestment = {
  budget: 5000000,
  currentEAL: 7240000,
  optimizedEAL: 4310000,
  reductionAmount: 2930000,
  reductionPercentage: 40.5,
  budgetUsedPercentage: 100,
  controls: [
    {
      name: "MFA",
      investment: 800000,
    },
    {
      name: "EDR Expansion",
      investment: 1500000,
    },
    {
      name: "Patch Automation",
      investment: 700000,
    },
    {
      name: "Backup Improvement",
      investment: 1000000,
    },
    {
      name: "Network Segmentation",
      investment: 1000000,
    },
  ],
};

export const scenarioComparison = [
  {
    scenario: "Current",
    investment: 0,
    modeledEAL: 7240000,
    riskReduction: null,
  },
  {
    scenario: "MFA Only",
    investment: 800000,
    modeledEAL: 5970000,
    riskReduction: 17.5,
  },
  {
    scenario: "EDR + MFA",
    investment: 2300000,
    modeledEAL: 4920000,
    riskReduction: 32,
  },
  {
    scenario: "Optimized",
    investment: 5000000,
    modeledEAL: 4310000,
    riskReduction: 40.5,
  },
];

export const mlRiskAnalytics = {
  asset: "Payment Database",
  prediction: "High",
  confidence: "92.4%",
  model: "XGBoost Risk Model",
  explanationMethod: "SHAP-style feature contributions",
};

export const riskTrend = [
  {
    period: "Q1",
    risk: 78,
  },
  {
    period: "Q2",
    risk: 74,
  },
  {
    period: "Q3",
    risk: 76,
  },
  {
    period: "Q4",
    risk: 72,
  },
];

export const complianceMappings = [
  {
    risk: "Unauthorized Account Access",
    controls: [
      "Multi-Factor Authentication",
      "Access Control",
      "Privileged Access Management",
    ],
    frameworks: [
      "NIST CSF",
      "CIS Controls",
      "ISO 27001",
      "RBI / SEBI",
    ],
  },
];

export const auditRecord = {
  assessmentId: "RA-1042",
  status: "Integrity Verified",
  recordHash: "8a93...f82d",
  timestamp: "2026-09-21 11:42",
};

export const copilotPrompts = [
  "What are our top risks?",
  "Why is the payment system high risk?",
  "What is our current EAL?",
  "What are the main risk drivers?",
  "What happens if we implement MFA?",
  "I have a ₹50 lakh budget. What should we invest in?",
  "Compare the current and optimized scenarios.",
];