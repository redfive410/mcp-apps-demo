# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install          # JS/TS
uv sync               # Python

# Build frontend widgets → assets/
pnpm build            # runs build-all.mts via tsx; sets BASE_URL for HTML generation

# Type check only (no emit)
pnpm tsc

# Start the MCP server (http://localhost:8000/mcp)
uv run python demo_server/main.py

# Serve built assets locally (http://localhost:4444)
pnpm serve

# Deploy to GCP Cloud Run
./deploy.sh
```

## Architecture

### Two-component system

**Python MCP server** (`demo_server/main.py`) and **React widget** (`src/demo/`) are two separate processes that communicate only through the MCP protocol — the widget runs inside an AI host (e.g. Claude.ai, ChatGPT) that invokes the server's tools and passes results to the widget.

### Build pipeline (`build-all.mts`)

`pnpm build` discovers every `src/**/index.{tsx,jsx}`, bundles each into `assets/<name>-<hash>.{js,css}`, then **inlines both** into a self-contained `assets/<name>.html` (and a hash-suffixed copy). Inlining avoids CORS issues when the HTML is served from a different origin than the host. The `BASE_URL` env var controls the base URL written into generated HTML (defaults to `http://localhost:4444`).

To add a new widget, create `src/<widget-name>/index.jsx` and add the name to the `targets` array in `build-all.mts`.

### Widget pattern (`src/demo/index.jsx`)

Each widget entry point wraps a display component with `useApp` from `@modelcontextprotocol/ext-apps/react`. The `app` object exposes:
- `app.ontoolresult` — called whenever the MCP host invokes a tool; receives `structuredContent` from the server
- `app.onhostcontextchanged` — notifies when `displayMode` changes (`"inline"` vs `"sidebar"` etc.)
- `app.callServerTool({ name, arguments })` — lets the widget call server tools directly
- `app.sendOpenLink({ url })` — requests the host to open a URL

### MCP server pattern (`demo_server/main.py`)

Uses **low-level FastMCP** (`mcp._mcp_server.request_handlers[...]`) rather than the decorator API, because the tools carry `_meta.ui.resourceUri` pointing to the widget resource (`ui://widget/demo.html`). This metadata is how the MCP host knows which widget to render alongside tool results.

The resource handler (`_handle_read_resource`) returns the widget's HTML from `assets/` with MIME type `text/html;profile=mcp-app`.

Counter state (`demo_value`) is an in-process global integer — it resets on server restart and is not thread-safe under concurrent requests.

### Deployment

`deploy.sh` builds the frontend, builds a Docker image (`python:3.13-slim` + `uv`), pushes to GCR, and deploys to Cloud Run in `us-west1`. On first deployment it uses a placeholder `BASE_URL`, then updates the service after the real URL is known. The MCP endpoint is at `<SERVICE_URL>/mcp`.
