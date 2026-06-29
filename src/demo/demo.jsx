import "./demo.css";

export default function DemoWidget({ toolResult, app, displayMode }) {
  // Extract data from tool result
  const toolOutput = toolResult?.structuredContent || toolResult;
  const counter = toolOutput?.counter;

  const jsonOutput = !toolOutput
    ? null
    : typeof toolOutput === "string"
    ? toolOutput
    : JSON.stringify(toolOutput, null, 2);

  const handleResetTool = async () => {
    if (app?.callServerTool) {
      try {
        const result = await app.callServerTool({ name: "reset", arguments: {} });
        console.log("Reset tool called, result:", result);
      } catch (error) {
        console.error("Error calling reset tool:", error);
      }
    } else {
      console.error("app.callServerTool is not available");
    }
  };

  const handleLinkClick = (url) => {
    if (app?.sendOpenLink) {
      app.sendOpenLink({ url });
    } else {
      window.open(url, "_blank");
    }
  };

  // Handle loading state
  if (!toolOutput) {
    return (
      <div className="demo-container">
        <h1>MCP Apps Demo</h1>
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          No tool output available. Tool output will appear here when a tool is invoked.
        </div>
      </div>
    );
  }

  return (
    <div className="demo-container">
      <h1>MCP Apps Demo</h1>

      <div className="tool-output">
        <h2>Tool Output Data:</h2>
        <pre style={{
          background: '#f5f5f5',
          color: '#1f2937',
          padding: '10px',
          borderRadius: '5px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {jsonOutput}
        </pre>
        {toolOutput && (
          <div>
            {toolOutput.message && (
              <p style={{ padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
                <strong>message:</strong> {toolOutput.message}
              </p>
            )}
            {counter !== undefined && (
              <p style={{ padding: '10px', background: '#e8f4f8', borderRadius: '5px', fontSize: '24px' }}>
                <strong>Counter:</strong> {String(counter)}
              </p>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleResetTool}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
        <button
          onClick={() => handleLinkClick("https://www.tramalfadore.com")}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Visit Tramalfadore
        </button>
      </div>

      {displayMode && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          Display mode: {displayMode}
        </div>
      )}
    </div>
  );
}
