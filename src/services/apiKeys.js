const STORAGE_KEY = "cyberrisk_api_keys";

const DEFAULT_KEYS = {
  // Tool 1: Vulnerability Scanner (SRC-001)
  nvdApiKey: "D7B1CB4C-56B6-F111-8375-0EBF96DE670D",
  snykApiKey: "",

  // Tool 2: SIEM (SRC-002)
  siemWebhookUrl: "b65ngyjfnNJ9KYs3CRazDxg3",

  // Tool 3: IAM (SRC-003)
  iamApiToken: "https://dev-3x1pwxdycp8xbagq.us.auth0.com/api/v2/",

  // Tool 4: EDR (SRC-004)
  edrApiKey: "8f204bdf-fbb4-48ae-bf83-c7ba0e1390aa",

  // Tool 5: CSPM (SRC-005)
  cspmApiToken: "cfk_X0jGWTo8aUMJJVjxRau8ryKB5heFVhh8b9d87nGc926194c3",

  // Tool 6: Asset Inventory (SRC-006)
  targetHost: "1.1.1.1",
  censysApiKey: "",

  // Tool 7: Threat Intelligence (SRC-007)
  alienvaultApiKey: "9c67ca49f3088b45cb89dc3f67cf6c55acb7701edea75060a42db23fb195438f",
  abuseipdbApiKey: "",

  // AI Copilot
  geminiApiKey: "AQ.Ab8RN6JCs5YX-cZWAqIEr7aWvAi22mPkNdANJNeWifmbmb8yog",
  groqApiKey: "",

  // Global settings
  autoSyncEnabled: true,
  autoSyncInterval: 30, // seconds
};

export const ALL_TOOLS_DOCS = [
  {
    id: "SRC-001",
    name: "Vulnerability Scanner",
    provider: "CISA KEV / NIST NVD / OSV.dev",
    keyField: "nvdApiKey",
    keyLabel: "NIST NVD API Key (or Snyk Key)",
    freeUrl: "https://nvd.nist.gov/developers/request-an-api-key",
    freeService: "CISA KEV & OSV.dev (Pre-connected with zero keys!)",
    instructions: "Live CISA KEV JSON catalog and Google OSV.dev query work automatically. Optional NIST NVD key raises rate limits.",
  },
  {
    id: "SRC-002",
    name: "SIEM (Security Information & Event Management)",
    provider: "Syslog Ingestion / Better Stack / Logz.io",
    keyField: "siemWebhookUrl",
    keyLabel: "SIEM Webhook URL / Better Stack Token",
    freeUrl: "https://betterstack.com/logs",
    freeService: "Better Stack Logs & Logz.io Community",
    instructions: "Connect any free syslog HTTP webhook or Better Stack token (1GB free/month) for live security telemetry ingestion.",
  },
  {
    id: "SRC-003",
    name: "IAM (Identity & Access Management)",
    provider: "Active Directory / Okta / Auth0 Management",
    keyField: "iamApiToken",
    keyLabel: "Auth0 / Okta API Token",
    freeUrl: "https://auth0.com/signup",
    freeService: "Auth0 Developer (7,000 free active users) or Okta Developer",
    instructions: "Pulls live identity posture, MFA adoption rates, and privileged accounts using standard Auth0/Okta management tokens.",
  },
  {
    id: "SRC-004",
    name: "EDR (Endpoint Detection & Response)",
    provider: "CrowdStrike / LimaCharlie / Wazuh Agent",
    keyField: "edrApiKey",
    keyLabel: "LimaCharlie EDR / VirusTotal Key",
    freeUrl: "https://limacharlie.io",
    freeService: "LimaCharlie EDR (2 sensors 100% free forever) or VirusTotal Public",
    instructions: "LimaCharlie offers full EDR telemetry and cloud sensor APIs completely free for small fleets.",
  },
  {
    id: "SRC-005",
    name: "CSPM (Cloud Security Posture Management)",
    provider: "Cloudflare / AWS SecurityAudit / CIS Benchmarks",
    keyField: "cspmApiToken",
    keyLabel: "Cloudflare API Token / AWS ReadOnly Key",
    freeUrl: "https://dash.cloudflare.com/profile/api-tokens",
    freeService: "Cloudflare Security Analytics (Free Tier) or AWS SecurityAudit",
    instructions: "Audits cloud security groups, open ports (0.0.0.0/0 on 22/3389), SSL/TLS posture, and CIS benchmarks.",
  },
  {
    id: "SRC-006",
    name: "Asset Inventory & Attack Surface Discovery",
    provider: "IP-API Infrastructure Probe & crt.sh Certificate Logs / Censys",
    keyField: "targetHost",
    keyLabel: "Target Host / IP to Scan (or Censys Key)",
    freeUrl: "https://censys.com/search",
    freeService: "IP-API & crt.sh (100% Free, Zero Signups, Zero Keys Needed)",
    instructions: "Zero signup needed! Uses live IP-API network prober and crt.sh certificate logs to map perimeter assets, open ports, and DNS hosts. Optional Censys account provides 250 free queries/mo.",
  },
  {
    id: "SRC-007",
    name: "Threat Intelligence",
    provider: "AlienVault OTX / AbuseIPDB / CISA Advisories",
    keyField: "alienvaultApiKey",
    keyLabel: "AlienVault OTX Key / AbuseIPDB Key",
    freeUrl: "https://otx.alienvault.com/api",
    freeService: "AlienVault OTX (Free Community) & AbuseIPDB (1,000 free daily checks)",
    instructions: "Ingests live threat actor campaigns (FIN7, LockBit 3.0), malicious IOCs, and active threat advisories.",
  },
  {
    id: "COPILOT",
    name: "AI Copilot Engine",
    provider: "Google Gemini 1.5 Flash / Groq LLaMA 3.3",
    keyField: "geminiApiKey",
    keyLabel: "Google Gemini API Key (or Groq Key)",
    freeUrl: "https://aistudio.google.com/app/apikey",
    freeService: "Google AI Studio (15 RPM / 1M TPM free) & Groq Cloud",
    instructions: "Enables real-time quantitative reasoning, simulation explanations, and investment optimization advice.",
  },
];

export const API_DOCS = {
  gemini: {
    name: "Google Gemini API",
    description: "Powers real-time reasoning and dynamic responses in the AI Copilot.",
    freeUrl: "https://aistudio.google.com/app/apikey",
    instructions: "Free tier offers 15 Requests/Min and 1 Million Tokens/Min at Google AI Studio.",
    hasFreeTier: true,
  },
  groq: {
    name: "Groq Cloud API (LLaMA 3.3)",
    description: "Ultra-fast open-source LLM alternative for AI Copilot.",
    freeUrl: "https://console.groq.com/keys",
    instructions: "Completely free instant API keys with high rate limits.",
    hasFreeTier: true,
  },
  nvd: {
    name: "NIST NVD API 2.0",
    description: "Official National Vulnerability Database API from US NIST.",
    freeUrl: "https://nvd.nist.gov/developers/request-an-api-key",
    instructions: "Free public API. An optional free key grants 50 requests per 30-second window.",
    hasFreeTier: true,
  },
  alienvault: {
    name: "AlienVault OTX",
    description: "Open Threat Exchange live threat intelligence indicators.",
    freeUrl: "https://otx.alienvault.com/api",
    instructions: "Free community threat exchange account provides immediate API key.",
    hasFreeTier: true,
  },
  cisa: {
    name: "CISA KEV Catalog",
    description: "Live Known Exploited Vulnerabilities catalog maintained by CISA.",
    freeUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    instructions: "Zero keys needed! 100% free public REST API and JSON catalog.",
    hasFreeTier: true,
  },
  shodan: {
    name: "Shodan InternetDB",
    description: "Instant port, hostname, and vulnerability scanner for any IP address.",
    freeUrl: "https://internetdb.shodan.io",
    instructions: "Zero keys needed! Completely free public API maintained by Shodan.",
    hasFreeTier: true,
  },
};

export function getApiKeys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_KEYS;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_KEYS };
    for (const [k, v] of Object.entries(DEFAULT_KEYS)) {
      merged[k] = parsed[k] && parsed[k] !== "" ? parsed[k] : v;
    }
    return merged;
  } catch (err) {
    console.error("Error reading API keys from localStorage", err);
    return DEFAULT_KEYS;
  }
}

export function saveApiKeys(keys) {
  try {
    const current = getApiKeys();
    const updated = { ...current, ...keys };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cyberrisk_keys_updated", { detail: updated }));
    return updated;
  } catch (err) {
    console.error("Error saving API keys to localStorage", err);
    return null;
  }
}

export function getApiKey(keyName) {
  const keys = getApiKeys();
  return keys[keyName] || "";
}
