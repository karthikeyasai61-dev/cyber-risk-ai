import { useState, useRef, useEffect } from "react";
import { useDemoState } from "../hooks/useDemoState";
import { getCopilotResponse } from "../services/copilot";

function AICopilot() {
  const { copilotPrompts } = useDemoState();
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "ai",
      content: "I am the CyberRisk AI Copilot. I can help you understand AegisBank's cybersecurity posture, explore risk drivers, simulate controls, and analyze quantitative investment recommendations.\n\nAll my responses are grounded in real calculations from the platform's quantitative risk engine, FAIR calculations, and live ingested threat intelligence.\n\nTry one of the suggested prompts below, or type any custom cybersecurity inquiry.",
      toolCall: null,
      toolResult: null,
      provider: "Platform Risk Core",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSend(question) {
    const q = question || input.trim();
    if (!q || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: q,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getCopilotResponse(q);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: response.answer,
        toolCall: response.toolCall,
        toolResult: response.toolResult,
        provider: response.provider || "Neural Risk Engine",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: `An error occurred while generating reasoning: ${err.message}`,
          toolCall: "error",
          toolResult: err.message,
          provider: "System Error",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function renderContent(text) {
    const lines = text.split("\n");
    const elements = [];
    let tableRows = [];
    let inTable = false;
    let listItems = [];
    let inList = false;

    function flushList() {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} style={{ margin: "8px 0", paddingLeft: 20, fontSize: "0.8125rem" }}>
            {listItems.map((li, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: formatBold(li) }} />
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    }

    function flushTable() {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const dataRows = tableRows.slice(1);
        elements.push(
          <div key={`table-${elements.length}`} style={{ overflowX: "auto", margin: "10px 0" }}>
            <table className="copilot-table" style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {header.map((col, i) => (
                    <th key={i} style={{ borderBottom: "2px solid var(--color-border)", padding: "6px 10px", textAlign: "left" }}>
                      {col.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ borderBottom: "1px solid var(--color-border)", padding: "5px 10px" }}>
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
      inTable = false;
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Markdown Table
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        if (inList) flushList();
        // Skip separator row like |---|---|
        if (/^\|[-|\s]+\|$/.test(line.trim())) {
          continue;
        }
        const cells = line
          .trim()
          .slice(1, -1)
          .split("|");
        tableRows.push(cells);
        inTable = true;
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Markdown List
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        listItems.push(line.trim().slice(2));
        inList = true;
        continue;
      } else if (inList) {
        flushList();
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h4 key={`h4-${i}`} style={{ margin: "14px 0 6px", fontSize: "0.875rem", fontWeight: 700 }}>
            {line.slice(4)}
          </h4>
        );
        continue;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h3 key={`h3-${i}`} style={{ margin: "16px 0 8px", fontSize: "0.9375rem", fontWeight: 700 }}>
            {line.slice(3)}
          </h3>
        );
        continue;
      }

      if (!line.trim()) {
        if (inList) flushList();
        continue;
      }

      elements.push(
        <p key={`p-${i}`} style={{ margin: "0 0 10px" }} dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
      );
    }

    if (inList) flushList();
    if (inTable) flushTable();

    return elements;
  }

  return (
    <div className="animate-in">
      {/* Top Engine Status Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          padding: "10px 16px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-small)",
          marginBottom: 16,
          fontSize: "0.8125rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--color-success-text)",
              boxShadow: "0 0 6px var(--color-success-text)",
            }}
          />
          <span>
            Quantitative AI Reasoning Engine: <strong>Continuous CyberRisk Neural Intelligence (Operational)</strong>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            ⚡ RAG Knowledge Retrieval Active
          </span>
        </div>
      </div>

      <div className="copilot-container">
        {/* Messages */}
        <div className="copilot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`copilot-message copilot-message--${msg.role}`}>
              <div className="copilot-message-header">
                <span className="copilot-message-role">
                  {msg.role === "ai" ? "CyberRisk AI Copilot" : "You (Risk Analyst)"}
                </span>
                {msg.provider && (
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      padding: "1px 6px",
                      borderRadius: 4,
                      background: "var(--color-surface-muted)",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {msg.provider}
                  </span>
                )}
              </div>

              <div className="copilot-message-body">{renderContent(msg.content)}</div>

              {msg.toolCall && (
                <div className="copilot-tool-call">
                  <span className="copilot-tool-name">Grounded Calculation: {msg.toolCall}</span>
                  {msg.toolResult && (
                    <span className="copilot-tool-result">
                      {typeof msg.toolResult === "string" ? msg.toolResult : JSON.stringify(msg.toolResult)}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="copilot-message copilot-message--ai">
              <div className="copilot-message-header">
                <span className="copilot-message-role">CyberRisk AI Copilot</span>
              </div>
              <div className="copilot-typing">
                <span className="copilot-typing-dot" />
                <span className="copilot-typing-dot" />
                <span className="copilot-typing-dot" />
                <span style={{ marginLeft: 8, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  Analyzing telemetry & computing financial risk...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="copilot-prompts">
          <p className="copilot-prompts-label">Suggested Inquiries:</p>
          <div className="copilot-prompts-list">
            {copilotPrompts.map((prompt) => (
              <button
                key={prompt.id}
                className="copilot-prompt-btn"
                onClick={() => handleSend(prompt.prompt)}
                disabled={isTyping}
              >
                <span className="copilot-prompt-category">{prompt.category}</span>
                <span className="copilot-prompt-text">{prompt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="copilot-input-bar">
          <textarea
            className="copilot-input"
            rows={2}
            placeholder="Ask about top financial risk drivers, simulate control deployments, or query vulnerabilities..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button
            className="btn btn-primary copilot-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            {isTyping ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatBold(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code style="background:var(--color-surface-muted);padding:1px 4px;border-radius:3px;font-size:0.75rem;">$1</code>');
}

export default AICopilot;
