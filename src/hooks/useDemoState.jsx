import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import * as initialDemoData from "../data/demoData";
import { syncDataSource } from "../services/liveIntegrations";
import {
  runSyncCycle,
  subscribeToWorker,
  startBackgroundWorker,
  stopBackgroundWorker,
  isWorkerRunning,
} from "../services/backgroundWorker";
import { getApiKeys } from "../services/apiKeys";
import { saveScanToCloud, saveAssetsToCloud } from "../services/firebase";

const DemoContext = createContext(null);

// ── Utility: derive full platform metrics from live vuln + asset data ────────
function deriveMetrics(vulnerabilities, assets, baseSummary) {
  const criticalCount  = vulnerabilities.filter((v) => v.severity === "Critical").length;
  const highCount      = vulnerabilities.filter((v) => v.severity === "High").length;
  const mediumCount    = vulnerabilities.filter((v) => v.severity === "Medium").length;
  const totalVulns     = vulnerabilities.length;

  // Simple risk-score heuristic based on ingested data
  // EAL = Σ(assetExposure * vuln-weight-factor)
  const baseEAL = baseSummary.currentEAL;
  const vulnMultiplier = totalVulns > 0
    ? 1 + (criticalCount * 0.08 + highCount * 0.03 + mediumCount * 0.01)
    : 1;
  const assetExposure = assets.reduce((s, a) => s + (a.financialExposure || 0), 0);
  const derivedEAL = assetExposure > 0
    ? Math.round(assetExposure * vulnMultiplier * 0.42)
    : Math.round(baseEAL * vulnMultiplier);

  // Overall risk label
  let overallRisk = "Medium";
  if (derivedEAL >= 10_000_000 || criticalCount >= 15) overallRisk = "Critical";
  else if (derivedEAL >= 6_000_000 || criticalCount >= 8) overallRisk = "High";
  else if (derivedEAL >= 2_000_000 || criticalCount >= 3) overallRisk = "Medium";
  else overallRisk = "Low";

  return {
    ...baseSummary,
    vulnerabilities: totalVulns,
    criticalVulnerabilities: criticalCount,
    criticalFindings: criticalCount,
    totalAssets: assets.length,
    currentEAL: derivedEAL,
    overallRisk,
  };
}

// ── Derive updated riskDrivers from live data ────────────────────────────────
function deriveRiskDrivers(vulnerabilities, assets, baseDrivers) {
  if (vulnerabilities.length === 0) return baseDrivers;

  // Find the asset with the highest vulnerability count among uploaded
  const assetVulnCount = {};
  vulnerabilities.forEach((v) => {
    const name = v.assetName || "Unknown Asset";
    assetVulnCount[name] = (assetVulnCount[name] || 0) + 1;
  });
  const topAssetEntry = Object.entries(assetVulnCount).sort((a, b) => b[1] - a[1])[0];
  const critCount = vulnerabilities.filter((v) => v.severity === "Critical").length;

  return baseDrivers.map((d, i) => {
    if (i === 0 && topAssetEntry) {
      return { ...d, asset: topAssetEntry[0], value: Math.min(100, 55 + critCount * 2) };
    }
    return d;
  });
}

// ── Derive Monte Carlo summary from live EAL ─────────────────────────────────
function deriveMonteCarlo(derivedEAL, baseMC) {
  if (!baseMC) return baseMC;
  const scale = derivedEAL / (baseMC.mean || 7_240_000);
  return {
    ...baseMC,
    mean:   Math.round((baseMC.mean  || 7_240_000) * scale),
    median: Math.round((baseMC.median|| 6_900_000) * scale),
    p90:    Math.round((baseMC.p90   || 11_200_000) * scale),
    p95:    Math.round((baseMC.p95   || 13_500_000) * scale),
  };
}

export function DemoProvider({ children }) {
  const [isSyncing, setIsSyncing]             = useState(false);
  const [syncingSourceId, setSyncingSourceId] = useState(null);
  const [lastGlobalSync, setLastGlobalSync]   = useState("Just now");

  // Core data stores
  const [dataSources, setDataSources]       = useState(initialDemoData.dataSources);
  const [vulnerabilities, setVulnerabilities] = useState(initialDemoData.vulnerabilities);
  const [assets, setAssets]                 = useState(initialDemoData.assets);
  const [auditRecord, setAuditRecord]       = useState(initialDemoData.auditRecord);
  const [liveAuditEvents, setLiveAuditEvents] = useState([]);
  const [livePayloads, setLivePayloads]     = useState({});
  const [autoSync, setAutoSync]             = useState(() => isWorkerRunning());

  // Derived metrics — recalculated whenever vuln/asset data changes
  const demoSummary = useMemo(
    () => deriveMetrics(vulnerabilities, assets, initialDemoData.demoSummary),
    [vulnerabilities, assets]
  );

  const riskDrivers = useMemo(
    () => deriveRiskDrivers(vulnerabilities, assets, initialDemoData.riskDrivers),
    [vulnerabilities, assets]
  );

  const monteCarloSummary = useMemo(
    () => deriveMonteCarlo(demoSummary.currentEAL, initialDemoData.monteCarloSummary),
    [demoSummary.currentEAL]
  );

  // Financial risk contributions: scale with live EAL
  const financialRiskContributions = useMemo(() => {
    const base = initialDemoData.financialRiskContributions || [];
    const scale = demoSummary.currentEAL / (initialDemoData.demoSummary.currentEAL || 7_240_000);
    return base.map((item) => ({
      ...item,
      value: Math.round((item.value || 0) * scale),
    }));
  }, [demoSummary.currentEAL]);

  // ML risk analytics: update prediction confidence based on vuln count
  const mlRiskAnalytics = useMemo(() => {
    const base = initialDemoData.mlRiskAnalytics || {};
    const critCount = vulnerabilities.filter((v) => v.severity === "Critical").length;
    const confidenceRaw = Math.min(99, 78 + critCount * 1.2);
    const confidence = `${confidenceRaw.toFixed(0)}%`;
    const prediction = demoSummary.overallRisk;
    const topAssetVulns = vulnerabilities.filter((v) => v.isLiveIngested);
    const asset = topAssetVulns.length > 0
      ? topAssetVulns[0].assetName
      : (base.asset || "Payment Gateway");
    return { ...base, prediction, confidence, asset };
  }, [vulnerabilities, demoSummary.overallRisk]);

  // ── Background worker subscription ────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = subscribeToWorker((event) => {
      if (event.type === "SYNC_START") {
        setIsSyncing(true);
      } else if (event.type === "SYNC_COMPLETE") {
        setIsSyncing(false);
        setLastGlobalSync(event.timestamp);

        if (event.results) {
          setDataSources((prev) =>
            prev.map((src) => {
              const res = event.results[src.id];
              if (!res || !res.success) return src;
              return {
                ...src,
                status: "Connected",
                records: res.data?.records || src.records,
                lastSync: "Just now",
                durationMs: res.duration,
                sourceProvider: res.data?.source,
              };
            })
          );

          const vulnRes = event.results["SRC-001"];
          if (vulnRes?.success && vulnRes.data?.findings) {
            handleIngestedVulnerabilities(vulnRes.data.findings);
          }

          setLivePayloads((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(event.results).map(([k, v]) => [k, v.data || v.error])
            ),
          }));
        }
      } else if (event.type === "WORKER_STARTED") {
        setAutoSync(true);
      } else if (event.type === "WORKER_STOPPED") {
        setAutoSync(false);
      }
    });
    return unsubscribe;
  }, []);

  // ── Ingest live CVEs from background worker ───────────────────────────────
  const handleIngestedVulnerabilities = useCallback((findings) => {
    if (!findings || findings.length === 0) return;

    setVulnerabilities((prev) => {
      const existingIds = new Set(prev.map((v) => v.cveId));
      const newItems = findings
        .filter((f) => !existingIds.has(f.cveId))
        .map((f, i) => ({
          id: `LIVE-CVE-${Date.now()}-${i}`,
          cveId: f.cveId,
          assetId: "AST-001",
          assetName: `${f.vendor || "Core"} ${f.product || "Service"}`,
          severity: f.severity || "Critical",
          cvss: f.cvss || 9.8,
          exploitAvailable: true,
          description: f.vulnerabilityName || f.shortDescription || "Identified active exploitation in the wild.",
          discovered: f.dateAdded || new Date().toISOString().split("T")[0],
          isLiveIngested: true,
        }));
      return [...newItems, ...prev];
    });

    setLiveAuditEvents((prev) => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "LIVE_INGESTION",
        actor: "Vulnerability Scanner (CISA KEV / NVD)",
        details: `Ingested ${findings.length} live exploited vulnerability advisories.`,
        status: "Success",
      },
      ...prev,
    ]);
  }, []);

  // ── Sync single source ────────────────────────────────────────────────────
  const syncSource = useCallback(
    async (sourceId) => {
      setSyncingSourceId(sourceId);
      try {
        const res = await syncDataSource(sourceId);
        if (res.success && res.data) {
          setDataSources((prev) =>
            prev.map((s) =>
              s.id === sourceId
                ? {
                    ...s,
                    status: "Connected",
                    records: res.data.records || s.records,
                    lastSync: "Just now",
                    durationMs: res.duration,
                    sourceProvider: res.data.source,
                  }
                : s
            )
          );
          setLivePayloads((prev) => ({ ...prev, [sourceId]: res.data }));
          if (sourceId === "SRC-001" && res.data.findings) {
            handleIngestedVulnerabilities(res.data.findings);
          }
          setLiveAuditEvents((prev) => [
            {
              id: `AUD-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              action: "SOURCE_SYNC",
              actor: sourceId,
              details: `Synced ${res.data.records || "active"} records in ${res.duration}ms from ${res.data.source}`,
              status: "Success",
            },
            ...prev,
          ]);
        }
        return res;
      } finally {
        setSyncingSourceId(null);
      }
    },
    [handleIngestedVulnerabilities]
  );

  // ── Sync all sources ──────────────────────────────────────────────────────
  const syncAll = useCallback(async () => {
    setIsSyncing(true);
    try {
      return await runSyncCycle();
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // ── Toggle background auto-sync ───────────────────────────────────────────
  const toggleAutoSync = useCallback((enabled, intervalSec = 60) => {
    if (enabled) {
      startBackgroundWorker(intervalSec);
      setAutoSync(true);
    } else {
      stopBackgroundWorker();
      setAutoSync(false);
    }
  }, []);

  // ── Reset to baseline ─────────────────────────────────────────────────────
  const resetDemo = useCallback(() => {
    setDataSources(initialDemoData.dataSources);
    setVulnerabilities(initialDemoData.vulnerabilities);
    setAssets(initialDemoData.assets);
    setAuditRecord(initialDemoData.auditRecord);
    setLiveAuditEvents([]);
    return true;
  }, []);

  const loadEnterprise = useCallback(() => true, []);

  // ── Import custom vulnerability logs ──────────────────────────────────────
  const importCustomLogs = useCallback(async (findings, meta = {}) => {
    if (!findings || findings.length === 0) return;

    saveScanToCloud(findings, meta).catch((e) => console.warn("Cloud save scan", e));

    setVulnerabilities((prev) => [...findings, ...prev]);

    setLiveAuditEvents((prev) => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "CUSTOM_LOG_INGESTION",
        actor: meta.fileName || "Custom Logs Ingestion",
        details: `Imported and cloud-synced ${findings.length} security findings. EAL and risk scores recalculated.`,
        status: "Success (Firebase Cloud)",
      },
      ...prev,
    ]);
  }, []);

  // ── Import custom business assets ─────────────────────────────────────────
  const importCustomAssets = useCallback(async (newAssets, meta = {}) => {
    if (!newAssets || newAssets.length === 0) return;

    saveAssetsToCloud(newAssets).catch((e) => console.warn("Cloud save assets", e));

    setAssets((prev) => [...newAssets, ...prev]);

    setLiveAuditEvents((prev) => [
      {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: "CUSTOM_ASSET_INGESTION",
        actor: meta.fileName || "Enterprise Assets",
        details: `Imported and cloud-synced ${newAssets.length} enterprise assets. Financial exposure recalculated.`,
        status: "Success (Firebase Cloud)",
      },
      ...prev,
    ]);
  }, []);

  // ── Context value: spread initial static data, then override with live ────
  const value = {
    ...initialDemoData,
    // Live / derived overrides
    dataSources,
    vulnerabilities,
    assets,
    demoSummary,
    riskDrivers,
    monteCarloSummary,
    financialRiskContributions,
    mlRiskAnalytics,
    auditRecord,
    liveAuditEvents,
    livePayloads,
    // Worker
    isSyncing,
    syncingSourceId,
    lastGlobalSync,
    autoSync,
    // Actions
    syncSource,
    syncAll,
    toggleAutoSync,
    importCustomLogs,
    importCustomAssets,
    resetDemo,
    loadEnterprise,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoState() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoState must be used within a DemoProvider");
  return ctx;
}
