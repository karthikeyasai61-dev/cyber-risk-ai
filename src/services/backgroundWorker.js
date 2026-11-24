import { syncDataSource } from "./liveIntegrations";
import { getApiKeys, saveApiKeys } from "./apiKeys";

let intervalId = null;
let isRunning = false;
let listeners = new Set();
let stats = {
  lastRunTime: null,
  totalRuns: 0,
  syncErrors: 0,
  latestResults: {},
};

export function subscribeToWorker(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners(data) {
  listeners.forEach((cb) => {
    try {
      cb(data);
    } catch (e) {
      console.error("Worker listener error", e);
    }
  });
}

/**
 * Execute a background sync cycle across all 7 sources
 */
export async function runSyncCycle(sources = ["SRC-001", "SRC-002", "SRC-003", "SRC-004", "SRC-005", "SRC-006", "SRC-007"]) {
  stats.lastRunTime = new Date().toLocaleTimeString();
  stats.totalRuns += 1;

  notifyListeners({ type: "SYNC_START", timestamp: stats.lastRunTime });

  const results = {};
  for (const srcId of sources) {
    try {
      const res = await syncDataSource(srcId);
      results[srcId] = res;
    } catch (err) {
      stats.syncErrors += 1;
      results[srcId] = { success: false, error: err.message };
    }
  }

  stats.latestResults = results;
  notifyListeners({
    type: "SYNC_COMPLETE",
    results,
    stats,
    timestamp: new Date().toLocaleTimeString(),
  });

  return results;
}

/**
 * Start the background polling worker
 */
export function startBackgroundWorker(intervalSec = 60) {
  if (isRunning) stopBackgroundWorker();

  const intervalMs = Math.max(15, intervalSec) * 1000;
  isRunning = true;
  saveApiKeys({ autoSyncEnabled: true, autoSyncInterval: intervalSec });

  // Initial immediate run
  runSyncCycle();

  intervalId = setInterval(() => {
    runSyncCycle();
  }, intervalMs);

  notifyListeners({ type: "WORKER_STARTED", intervalSec });
  return true;
}

/**
 * Stop the background polling worker
 */
export function stopBackgroundWorker() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isRunning = false;
  saveApiKeys({ autoSyncEnabled: false });
  notifyListeners({ type: "WORKER_STOPPED" });
  return false;
}

export function isWorkerRunning() {
  return isRunning;
}

export function getWorkerStats() {
  return { ...stats, isRunning };
}

// Auto-initialize worker if user previously enabled autoSync in localStorage
try {
  const keys = getApiKeys();
  if (keys.autoSyncEnabled) {
    startBackgroundWorker(keys.autoSyncInterval || 60);
  }
} catch (e) {
  console.warn("Could not auto-start background worker", e);
}
