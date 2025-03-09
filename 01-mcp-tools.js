import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// Set up the SSE client transport
const transport = new SSEClientTransport(new URL("http://localhost:3001/sse"));

// Create the MCP Client
const mcpClient = new Client(
  {
    name: "mcp-sse-client",
    version: "1.0.0",
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {},
      logging: {},
    },
  }
);

// Function to fetch the list of tools
async function fetchTools() {
  try {
    const result = await mcpClient.listTools();
    return result;
  } catch (error) {
    console.error("❌ Error fetching tools:", error);
  }
}

async function startClient() {
  // Connect to the SSE server
  await mcpClient.connect(transport);

  console.log("🔍 Fetching available tools...");
  // Fetch tools
  let mcpTools = await fetchTools();

  console.log("✅ Available Tools:");

  mcpTools.tools.forEach((tool) => {
    console.log("🔨 tool:", tool.name);
    console.log("🔨 schema:", tool.inputSchema);
  });

  // Exit the client
  mcpClient.close();
}

// Start the client
startClient();

