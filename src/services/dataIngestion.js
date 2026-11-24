import { saveScanToCloud, saveAssetsToCloud } from "./firebase";

/**
 * Universal CSV Parser that handles quoted strings and comma separations
 */
export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple regex to match comma-delimited fields respecting quotes
    const values = [];
    let current = "";
    let insideQuotes = false;

    for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
      const char = rawLine[charIdx];
      if (char === '"' || char === "'") {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ""));
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ""));

    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || "";
    });
    records.push(obj);
  }

  return records;
}

/**
 * Auto-detect and parse either CSV or JSON data
 */
export function parseUploadedData(rawContent) {
  const trimmed = rawContent.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      throw new Error("Invalid JSON format: " + e.message);
    }
  }

  // Otherwise assume CSV
  const csvParsed = parseCSV(trimmed);
  if (csvParsed.length === 0) {
    throw new Error("Could not parse file. Please verify CSV or JSON format.");
  }
  return csvParsed;
}

/**
 * Normalizes raw records into vulnerability findings
 */
export function normalizeVulnerabilityFindings(records) {
  return records.map((r, index) => {
    const cveId = r.cve_id || r.cveId || r.cve || r.vulnerability || `CVE-CUSTOM-${Date.now()}-${index}`;
    const assetName = r.server_name || r.serverName || r.host || r.asset || r.ip_address || "Internal App Server";
    const cvss = parseFloat(r.cvss || r.score || r.cvss_score || 7.5);
    const severity = r.severity || (cvss >= 9 ? "Critical" : cvss >= 7 ? "High" : "Medium");
    const description = r.description || r.details || r.event || "Security finding detected on internal system.";
    const exploitAvailable = r.is_exploit_available === "true" || r.exploitAvailable === true || cvss >= 9;

    return {
      id: `UPLOAD-CVE-${Date.now()}-${index}`,
      cveId,
      assetId: `AST-CUSTOM-${index + 1}`,
      assetName,
      severity,
      cvss,
      exploitAvailable,
      description,
      discovered: new Date().toISOString().split("T")[0],
      source: "Uploaded Log",
    };
  });
}

/**
 * Normalizes raw records into enterprise business assets
 */
export function normalizeBusinessAssets(records) {
  return records.map((r, index) => {
    const name = r.asset_name || r.assetName || r.name || r.server_name || `Server Node #${index + 1}`;
    const type = r.type || r.asset_type || "Infrastructure Server";
    const businessCriticality = r.criticality || r.businessCriticality || "High";
    const dataSensitivity = r.sensitivity || r.dataSensitivity || "Sensitive";
    const internetExposure = r.exposure || r.internetExposure || "Internal";
    const financialExposure = parseInt(r.financial_value || r.financialValue || r.value || 1200000, 10);

    return {
      id: `AST-UPL-${Date.now()}-${index}`,
      name,
      type,
      businessCriticality,
      dataSensitivity,
      internetExposure,
      vulnerabilityCount: parseInt(r.vulnerabilities || 2, 10),
      criticalVulnerabilityCount: parseInt(r.critical_vulnerabilities || 1, 10),
      securityControlStatus: "Partial",
      currentRisk: businessCriticality === "Critical" ? "Very High" : "High",
      financialExposure,
    };
  });
}

/**
 * Sample Pre-built Datasets for 1-Click Testing
 */
export const SAMPLE_INTERNAL_LOGS_CSV = `server_name,ip_address,cve_id,cvss,severity,description,data_sensitivity
Core Banking DB,192.168.10.45,CVE-2025-5512,8.8,High,Stored Procedure Privilege Escalation,Highly Sensitive
Active Directory DC01,192.168.10.10,CVE-2026-0042,9.2,Critical,Kerberos Unauthenticated Ticket Forgery,Highly Sensitive
Internal Payment API,192.168.20.15,CVE-2026-1029,9.8,Critical,RCE in Message Broker Service,Highly Sensitive
Backup Storage Cluster,192.168.30.8,CVE-2024-38063,7.5,High,TCP/IP Stack Buffer Overflow,Sensitive`;

export const SAMPLE_BUSINESS_ASSETS_CSV = `asset_name,type,criticality,sensitivity,exposure,financial_value
Core Banking DB,Database,Critical,Highly Sensitive,Internal,25000000
Customer Payment Gateway,API Service,Critical,Highly Sensitive,Internet,18000000
Internal Active Directory,Identity Infrastructure,Critical,Highly Sensitive,Internal,14000000
Corporate HR Portal,Web Application,Medium,Internal,Internal,3500000`;
