// MCP Apps SDK Types

export type DisplayMode = "inline" | "fullscreen" | "detached";

export interface ToolResult {
  content: Array<{ type: string; text: string }>;
  structuredContent: any;
  _meta: Record<string, any>;
  isError: boolean;
}

export interface AppInstance {
  openLink: (params: { url: string }) => Promise<void>;
  requestDisplayMode: (params: { mode: string }) => Promise<void>;
  callTool?: (name: string, args: any) => Promise<any>;
  ontoolresult: ((params: any) => void) | null;
  onhostcontextchanged: ((params: any) => void) | null;
}

export interface WidgetProps {
  toolResult: ToolResult | null;
  app?: AppInstance;
  displayMode?: DisplayMode;
}
