import { securityControls, demoSummary } from "../data/demoData";
import { combinedEAL, reductionMetrics } from "../utils/calculations";

const BASE_EAL = demoSummary.currentEAL;

/**
 * Simulate applying a single security control.
 * Returns before/after EAL and reduction metrics.
 */
export function simulateControl(controlId) {
  const ctrl = securityControls.find((c) => c.id === controlId);
  if (!ctrl) return null;

  return {
    controlName: ctrl.name,
    shortName: ctrl.shortName,
    cost: ctrl.cost,
    currentEAL: BASE_EAL,
    newEAL: ctrl.modeledEAL,
    reductionAmount: ctrl.reductionAmount,
    reductionPercentage: ctrl.reductionPercentage,
    riskReduction: ctrl.riskReduction,
  };
}

/**
 * Simulate applying multiple security controls together.
 * Uses multiplicative model for diminishing returns.
 */
export function simulateMultipleControls(controlIds) {
  if (!controlIds || controlIds.length === 0) {
    return {
      currentEAL: BASE_EAL,
      newEAL: BASE_EAL,
      reductionAmount: 0,
      reductionPercentage: 0,
      controls: [],
      totalCost: 0,
    };
  }

  const newEAL = combinedEAL(controlIds);
  const metrics = reductionMetrics(newEAL);
  const selectedControls = controlIds
    .map((id) => securityControls.find((c) => c.id === id))
    .filter(Boolean);
  const cost = selectedControls.reduce((sum, c) => sum + c.cost, 0);

  return {
    currentEAL: BASE_EAL,
    newEAL,
    reductionAmount: metrics.amount,
    reductionPercentage: metrics.percentage,
    controls: selectedControls,
    totalCost: cost,
  };
}
