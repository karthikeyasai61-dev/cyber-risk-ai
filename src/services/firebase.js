import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyAPLhD1VFV7H4-Yb-M4HbVMwxB-e8o3QV0",
  authDomain: "cyber-risk-ai.firebaseapp.com",
  projectId: "cyber-risk-ai",
  storageBucket: "cyber-risk-ai.firebasestorage.app",
  messagingSenderId: "293318046805",
  appId: "1:293318046805:web:0bf91b5c2f0c933e8250dc",
  measurementId: "G-WBWZ7RGFW6",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/**
 * Save custom uploaded scan findings (JSON or CSV parsed items) to Cloud Firestore
 */
export async function saveScanToCloud(scanItems, meta = {}) {
  try {
    const docRef = await addDoc(collection(db, "security_scans"), {
      timestamp: new Date().toISOString(),
      findingsCount: scanItems.length,
      meta,
      findings: scanItems.slice(0, 100), // store up to 100 items per doc
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.warn("Firestore save scan failed, operating offline", err);
    return { success: false, error: err.message };
  }
}

/**
 * Save enterprise assets to Cloud Firestore
 */
export async function saveAssetsToCloud(assets) {
  try {
    await setDoc(doc(db, "enterprise_data", "active_assets"), {
      updatedAt: new Date().toISOString(),
      assets,
    });
    return { success: true };
  } catch (err) {
    console.warn("Firestore save assets failed", err);
    return { success: false, error: err.message };
  }
}

/**
 * Save audit log to Cloud Firestore
 */
export async function saveAuditToCloud(auditEntry) {
  try {
    const docRef = await addDoc(collection(db, "audit_ledger"), {
      ...auditEntry,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.warn("Firestore save audit failed", err);
    return { success: false, error: err.message };
  }
}

/**
 * Check Firebase connection status
 */
export async function checkFirebaseConnection() {
  try {
    const testDoc = await getDoc(doc(db, "enterprise_data", "active_assets"));
    return { connected: true, exists: testDoc.exists() };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}
