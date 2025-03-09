import { ChatOllama } from "@langchain/ollama";
import { z } from "zod";
import { tool } from "@langchain/core/tools";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";


const llm = new ChatOllama({
  model: "qwen2.5:0.5b",
  baseUrl: "http://localhost:11434",
  temperature: 0.0,
});


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

  // Transform MCP Tools list to a tools list understandable by the LLM
  // Use the DynamicTool (Langchain Tools)
  let langchainTools = mcpTools.tools.map((mcpTool) => {
    return tool(null, {
      name: mcpTool.name,
      description: mcpTool.description || "No description provided",
      schema: jsonSchemaToZod(mcpTool.inputSchema),
    });
  });

  // Bind the dynamic tools to the LLM instance
  const llmWithTools = llm.bindTools(langchainTools);

  let messages = [
    ["system", "You are a useful AI agent. You can help users to roll dice."],
    ["user", "🎲 Rolling 3 dice(s) with 12 faces"],
  ];

  // Invoke the LLM with the messages
  let llmOutput = await llmWithTools.invoke(messages);

  // Output the LLM response
  console.log("📦 LLM (response )Output:");
  console.log("llmOutput:", llmOutput.tool_calls[0]);

  // Call the tool via MCP with the LLM response
  let result = await mcpClient.callTool({
    name: llmOutput.tool_calls[0].name,
    arguments: llmOutput.tool_calls[0].args,
  });

  console.log("✅ Server Response:", result);

  // Exit the client
  mcpClient.close();
}

// Start the client
startClient();


/**
 * Convert a JSON Schema object to a Zod schema object.
 * @param {object} jsonSchema - The JSON Schema object to convert
 * @returns {object} - The Zod schema object
 */
function jsonSchemaToZod(jsonSchema) {
  if (!jsonSchema || jsonSchema.type !== "object" || !jsonSchema.properties) {
    return z.object({});
  }

  const shape = {};
  for (const [key, value] of Object.entries(jsonSchema.properties)) {
    let zodType;

    // Map JSON Schema types to Zod types
    switch (value.type) {
      case "string":
        zodType = z.string();
        break;
      case "number":
        zodType = z.number();
        break;
      case "integer":
        zodType = z.number().int();
        break;
      case "boolean":
        zodType = z.boolean();
        break;
      case "array":
        zodType = z.array(jsonSchemaToZod(value.items));
        break;
      case "object":
        zodType = jsonSchemaToZod(value);
        break;
      default:
        zodType = z.any(); // Default case if type is unknown
    }

    // Add optionality if `required` is missing
    if (!jsonSchema.required?.includes(key)) {
      zodType = zodType.optional();
    }

    shape[key] = zodType;
  }

  return z.object(shape);
}