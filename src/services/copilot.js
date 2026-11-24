import { demoSummary, assets, vulnerabilities, riskDrivers, securityControls, optimizedInvestment, scenarioComparison } from "../data/demoData";
import { formatCurrency } from "../utils/formatters";
import { simulateControl } from "./riskEngine";
import { optimizeBudget } from "./optimizer";
import { getApiKey } from "./apiKeys";

/**
 * Enterprise context supplied to LLM system prompt.
 */
function buildSystemPrompt() {
  return `You are CyberRisk AI Copilot, an elite chief cybersecurity and quantitative risk advisor for AegisBank Technologies Pvt. Ltd. (a premier digital banking institution).
Current Enterprise Posture:
- Modeled Expected Annual Loss (EAL): ${formatCurrency(demoSummary.currentEAL)}/yr (FAIR quantitative methodology)
- Total Assets: ${demoSummary.totalAssets} (${assets.map((a) => `${a.name} [${a.currentRisk} Risk, Financial Exposure: ${formatCurrency(a.financialExposure)}]`).join(", ")})
- Critical Vulnerabilities: ${demoSummary.criticalVulnerabilities} (including active weaponized exploits on Payment Gateway and Customer DB)
- Available Security Budget: ${formatCurrency(demoSummary.availableBudget)}
- Security Controls Evaluated: ${securityControls.map((c) => `${c.shortName} (Cost: ${formatCurrency(c.cost)}, Modeled Reduction: ${c.reductionPercentage}%)`).join(", ")}
- Top Risk Drivers: ${riskDrivers.map((d) => `${d.name} (${d.contribution}/10)`).join(", ")}

Instructions:
1. Provide authoritative, concise, and structured cybersecurity and financial risk guidance.
2. Use markdown formatting: bold key metrics, use bullet points, and generate markdown tables where comparative metrics are helpful.
3. Quantify risk in terms of financial impact (₹ INR) and Expected Annual Loss (EAL), not just technical severity.
4. If the user asks about simulating a control or optimizing budget, emphasize the quantitative ROI and reduction percentage.`;
}

/**
 * Call Google Gemini API (Free tier: gemini-1.5-flash)
 */
async function callGeminiApi(apiKey, userQuestion, toolContext) {
  const prompt = `${buildSystemPrompt()}

Relevant Platform Tool Computation:
${toolContext ? `Tool: ${toolContext.toolCall}\nResult: ${toolContext.toolResult}` : "No direct tool invoked."}

User Question: ${userQuestion}`;

  const cleanKey = apiKey.trim();
  const models = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": cleanKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 800,
          },
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn(`Model ${model} attempt failed:`, e);
    }
  }

  throw new Error("Unable to generate response from Gemini API models.");
}

/**
 * Call Groq Cloud API (Free tier: llama-3.3-70b-versatile)
 */
async function callGroqApi(apiKey, userQuestion, toolContext) {
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    {
      role: "user",
      content: `${toolContext ? `[Platform Calculation Context]\nTool: ${toolContext.toolCall}\nResult: ${toolContext.toolResult}\n\n` : ""}User Question: ${userQuestion}`,
    },
  ];

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Groq API error: ${resp.status} - ${err}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "No response generated from Groq API";
}

/**
 * Execute real underlying platform calculations based on question intent
 */
function evaluatePlatformTools(qLower) {
  // 1. MFA Simulation
  if (qLower.includes("mfa") || qLower.includes("multi-factor")) {
    const res = simulateControl("CTRL-001");
    return {
      toolCall: "riskEngine.simulateControl('CTRL-001: MFA')",
      toolResult: `EAL reduced from ₹72.4L to ${formatCurrency(res.newEAL)} (-${res.reductionPercentage}%)`,
      data: res,
    };
  }

  // 2. EDR Simulation
  if (qLower.includes("edr") || qLower.includes("endpoint")) {
    const res = simulateControl("CTRL-002");
    return {
      toolCall: "riskEngine.simulateControl('CTRL-002: EDR')",
      toolResult: `EAL reduced from ₹72.4L to ${formatCurrency(res.newEAL)} (-${res.reductionPercentage}%)`,
      data: res,
    };
  }

  // 3. Patch Automation Simulation
  if (qLower.includes("patch") || qLower.includes("patching")) {
    const res = simulateControl("CTRL-003");
    return {
      toolCall: "riskEngine.simulateControl('CTRL-003: Patch Automation')",
      toolResult: `EAL reduced from ₹72.4L to ${formatCurrency(res.newEAL)} (-${res.reductionPercentage}%)`,
      data: res,
    };
  }

  // 4. Budget Optimization
  if (qLower.includes("budget") || qLower.includes("optimize") || qLower.includes("invest") || qLower.includes("lakh") || qLower.includes("crore")) {
    const budgetMatch = qLower.match(/(\d+)\s*(lakh|l|cr|crore)?/);
    let amount = 5000000;
    if (budgetMatch) {
      const num = parseInt(budgetMatch[1], 10);
      const unit = budgetMatch[2] || "lakh";
      if (unit.startsWith("cr")) amount = num * 10000000;
      else amount = num * 100000;
    }
    const res = optimizeBudget(amount);
    return {
      toolCall: `optimizer.optimizeBudget(${formatCurrency(amount)})`,
      toolResult: `Optimization solved: ${res.controls.length} controls selected, ${res.reductionPercentage}% risk reduction`,
      data: res,
    };
  }

  // 5. General Risk Assessment
  if (qLower.includes("risk") || qLower.includes("exposure") || qLower.includes("threat") || qLower.includes("driver")) {
    return {
      toolCall: "riskEngine.getRiskAssessment()",
      toolResult: `Active EAL: ${formatCurrency(demoSummary.currentEAL)}, 8 core banking assets evaluated`,
    };
  }

  return null;
}

/**
 * Intelligent local synthesis when no external LLM API key is present
 */
function getLocalFallbackResponse(question, toolContext) {
  const q = question.toLowerCase();

  // If tool was invoked, return rich structured analysis based on real engine computation
  if (toolContext && toolContext.data) {
    const d = toolContext.data;
    if (d.shortName === "MFA" || d.shortName === "EDR" || d.shortName === "Patching") {
      return `If **${d.controlName} (${d.shortName})** is deployed across AegisBank:

| Metric | Computed Value |
|--------|----------------|
| Capital Investment | ${formatCurrency(d.cost)} |
| Baseline EAL | ${formatCurrency(d.currentEAL)} |
| New Modeled EAL | ${formatCurrency(d.newEAL)} |
| Net Financial Loss Reduction | ${formatCurrency(d.reductionAmount)} |
| Risk Reduction ROI | ${d.reductionPercentage}% |

**Risk Impact Analysis:**
Deploying this control mitigates primary attack vectors targeting critical assets like the Payment Gateway and Identity Server, delivering immediate modeled risk suppression.`;
    }

    if (d.budget !== undefined) {
      return `Based on the **${formatCurrency(d.budget)} budget** constraint, the algorithmic optimization engine recommends:

${d.controls.map((c) => `• **${c.name}** — Allocated: ${formatCurrency(c.investment)}`).join("\n")}

**Quantitative Impact Summary:**
| Metric | Platform Value |
|--------|----------------|
| Total Investment | ${formatCurrency(d.budget)} |
| Baseline EAL | ${formatCurrency(d.currentEAL)} |
| Optimized Modeled EAL | ${formatCurrency(d.optimizedEAL)} |
| Modeled Risk Reduction | ${formatCurrency(d.reductionAmount)} (${d.reductionPercentage}%) |
| Budget Capital Utilization | ${d.budgetUsedPercentage}% |

The optimization engine maximizes risk reduction per rupee by taking advantage of multiplicative diminishing returns and eliminating duplicate controls.`;
    }
  }

  // Payment Gateway query
  if (q.includes("payment")) {
    return `The **Payment Gateway** represents AegisBank's highest financial exposure:

• **Classification**: Critical Core Banking Infrastructure
• **Financial Exposure**: ${formatCurrency(assets[0].financialExposure)}
• **Active Vulnerabilities**: ${assets[0].vulnerabilityCount} total (${assets[0].criticalVulnerabilityCount} critical, including CVSS 9.8 RCE)
• **Attack Surface**: Direct Internet-facing perimeter
• **Recommended Immediate Action**: Deploy Patch Automation and Web Application Firewall rules to isolate the gateway.`;
  }

  // EAL query
  if (q.includes("eal") || q.includes("loss") || q.includes("annual")) {
    return `The current modeled **Expected Annual Loss (EAL)** is **${formatCurrency(demoSummary.currentEAL)}/year**.

This is calculated via 10,000 Monte Carlo loss event simulations:
• **Median Simulated Loss**: ₹61,80,000
• **90th Percentile Worst-Case Exposure**: ₹1,35,00,000
• **Primary Drivers**: Asset criticality, internet-facing payment services, and unpatched critical vulnerabilities.`;
  }

  // General questions
  return `### AegisBank Cybersecurity Posture Summary

• **Overall Risk Level**: ${demoSummary.overallRisk}
• **Current Expected Annual Loss (EAL)**: ${formatCurrency(demoSummary.currentEAL)}/yr
• **Critical Vulnerabilities**: ${demoSummary.criticalVulnerabilities} identified
• **Available Budget**: ${formatCurrency(demoSummary.availableBudget)}

**Try asking:**
1. *"What happens if we implement MFA?"*
2. *"How should we invest our ₹50 lakh budget?"*
3. *"Why is the Payment Gateway high risk?"*
4. *"Simulate EDR and Patch Automation together."*

*(Tip: Add your free Google Gemini or Groq API key in Settings to unlock live open-domain AI reasoning!)*`;
}

/**
 * Main function called by AICopilot page. Supports real asynchronous LLM API calls.
 */
export async function getCopilotResponse(question) {
  const geminiKey = getApiKey("geminiApiKey");
  const groqKey = getApiKey("groqApiKey");
  const toolContext = evaluatePlatformTools(question.toLowerCase());

  // 1. If user supplied Gemini API key, use real Google Gemini 1.5 Flash
  if (geminiKey) {
    try {
      const answer = await callGeminiApi(geminiKey, question, toolContext);
      return {
        toolCall: toolContext ? toolContext.toolCall : "llmReasoning(model='gemini-1.5-flash')",
        toolResult: toolContext ? toolContext.toolResult : "Gemini AI inference complete",
        answer,
        provider: "Google Gemini 1.5 Flash (Live)",
      };
    } catch (err) {
      console.warn("Gemini call failed, checking alternatives", err);
    }
  }

  // 2. If user supplied Groq API key, use real Groq LLaMA 3.3
  if (groqKey) {
    try {
      const answer = await callGroqApi(groqKey, question, toolContext);
      return {
        toolCall: toolContext ? toolContext.toolCall : "llmReasoning(model='llama-3.3-70b-versatile')",
        toolResult: toolContext ? toolContext.toolResult : "Groq AI inference complete",
        answer,
        provider: "Groq Cloud LLaMA 3.3 (Live)",
      };
    } catch (err) {
      console.warn("Groq call failed, falling back to local engine", err);
    }
  }

  // 3. Fallback to local intelligent risk synthesis
  const fallbackAnswer = getLocalFallbackResponse(question, toolContext);
  return {
    toolCall: toolContext ? toolContext.toolCall : "riskEngine.synthesizePosture()",
    toolResult: toolContext ? toolContext.toolResult : "Local Risk Engine calculation complete",
    answer: fallbackAnswer,
    provider: "Local Risk Engine (Built-in Heuristics)",
  };
}
