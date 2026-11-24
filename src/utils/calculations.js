import { securityControls, demoSummary } from "../data/demoData";

const BASE_EAL = demoSummary.currentEAL;

/**
 * Calculate the combined EAL after applying multiple controls.
 * Uses multiplicative risk reduction to model diminishing returns.
 *
 * If a single control reduces risk by 17.5%, the remaining factor is 0.825.
 * Two controls with 17.5% and 25.4% → remaining = 0.825 * 0.746 = 0.615
 * → combined reduction ≈ 38.5%.
 */
export function combinedEAL(controlIds) {
  if (!controlIds || controlIds.length === 0) return BASE_EAL;

  let remainingFactor = 1;
  controlIds.forEach((id) => {
    const ctrl = securityControls.find((c) => c.id === id);
    if (ctrl) {
      remainingFactor *= 1 - ctrl.reductionPercentage / 100;
    }
  });

  return Math.round(BASE_EAL * remainingFactor);
}

/**
 * Calculate total cost of selected controls.
 */
export function totalCost(controlIds) {
  return controlIds.reduce((sum, id) => {
    const ctrl = securityControls.find((c) => c.id === id);
    return sum + (ctrl ? ctrl.cost : 0);
  }, 0);
}

/**
 * Calculate risk reduction amount and percentage from a new EAL.
 */
export function reductionMetrics(newEAL) {
  const amount = BASE_EAL - newEAL;
  const percentage = ((amount / BASE_EAL) * 100).toFixed(1);
  return { amount, percentage: parseFloat(percentage) };
}

/**
 * Calculate "efficiency ratio": risk reduction per lakh invested.
 */
export function efficiencyRatio(controlId) {
  const ctrl = securityControls.find((c) => c.id === controlId);
  if (!ctrl) return 0;
  return ctrl.reductionAmount / (ctrl.cost / 100000);
}
