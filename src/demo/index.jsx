import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import DemoWidget from "./demo";

function DemoWidgetWrapper() {
  const { app, isConnected, error: connectionError } = useApp({
    appInfo: { name: "MCP Apps Demo", version: "1.0.0" },
    capabilities: {},
  });
  const [toolResult, setToolResult] = useState(null);
  const [displayMode, setDisplayMode] = useState("inline");
  const [toolError, setToolError] = useState(null);

  useEffect(() => {
    if (!app) return;

    app.ontoolresult = (params) => {
      if (params?.isError) {
        setToolError(params.content?.[0]?.text || "An error occurred");
        setToolResult(null);
      } else {
        setToolResult(params);
        setToolError(null);
      }
    };

    app.onhostcontextchanged = (params) => {
      if (params.displayMode) {
        setDisplayMode(params.displayMode);
      }
    };
  }, [app]);

  if (connectionError) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <div>Connection error: {connectionError.message}</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>Connecting to host...</div>
      </div>
    );
  }

  if (toolError) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <div>Error: {toolError}</div>
      </div>
    );
  }

  return (
    <DemoWidget
      toolResult={toolResult}
      app={app}
      displayMode={displayMode}
    />
  );
}

const root = createRoot(document.getElementById("demo-root"));
root.render(<DemoWidgetWrapper />);

export { DemoWidgetWrapper };
export default DemoWidgetWrapper;
