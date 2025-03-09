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

async function startClient() {
  // Connect to the SSE server
  await mcpClient.connect(transport);

  // Resources
  const resources = await mcpClient.listResources();
  console.log("📦 Available Resources:", resources);

  const llmInstruction = await mcpClient.readResource({
    uri: "llm://instructions",
  });
  // Resource Content:
  let systemInstructions = llmInstruction.contents[0].text;
  console.log("📝 System Instructions:", systemInstructions);

  // Exit the client
  mcpClient.close();
}

// Start the client
startClient();

