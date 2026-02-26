# MCP Apps Demo

A demo application showcasing the MCP Apps SDK with a simple counter widget that integrates with AI platforms via the Model Context Protocol.

## Features

- **Counter Widget**: Interactive UI with increment, decrement, and reset tools
- **MCP Server**: Python FastMCP server exposing tools and widget resources
- **React Frontend**: Widget built with React and the MCP Apps SDK

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- [pnpm](https://pnpm.io/)
- [uv](https://github.com/astral-sh/uv) (Python package manager)

### Installation

```bash
# Install frontend dependencies
pnpm install

# Install Python dependencies
uv sync
```

### Build

```bash
# Build frontend assets
pnpm build
```

### Run

```bash
# Start the MCP server
uv run python demo_server/main.py
```

The server will start at `http://localhost:8000/mcp`.

## Project Structure

```
├── src/
│   └── demo/
│       ├── index.jsx      # Widget entry point with MCP wrapper
│       ├── demo.jsx       # Main widget component
│       └── demo.css       # Widget styles
├── demo_server/
│   └── main.py            # FastMCP server with tools
├── assets/                # Built widget HTML/CSS/JS
├── build-all.mts          # Build script
└── pyproject.toml         # Python project config
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `increment` | Increment the counter by a specified amount (default: 1) |
| `decrement` | Decrement the counter by a specified amount (default: 1) |
| `reset` | Reset the counter to zero |

## Development

The frontend uses the `@modelcontextprotocol/ext-apps` SDK with the `useApp` hook pattern for handling tool results and display mode changes.

## Deployment

A `Dockerfile` and `deploy.sh` script are included for deploying to GCP Cloud Run.
