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

  // Prompts
  const prompts = await mcpClient.listPrompts();
  console.log("📣 Available Prompts:", JSON.stringify(prompts, null, 2));

  const prompt = await mcpClient.getPrompt({
    name: "roll-dice",
    arguments: { numDice: "3", numFaces: "12" }, // always use strings for arguments
  });
  let userInstructions = prompt.messages[0].content.text;
  console.log("📝 User Instructions:", userInstructions);


  // Exit the client
  mcpClient.close();
}

// Start the client
startClient();

