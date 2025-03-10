import { ChatOllama } from "@langchain/ollama";
import { z } from "zod";
import { tool } from "@langchain/core/tools";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// Set up the SSE client transport
const transport = new SSEClientTransport(new URL("http://localhost:3001/sse"));

const llmTools = new ChatOllama({
  model: "qwen2.5:0.5b",
  baseUrl: "http://localhost:11434",
  temperature: 0.0,
});

const llmResult = new ChatOllama({
  model: "qwen2.5:1.5b",
  baseUrl: "http://localhost:11434",
  temperature: 0.0,
  repeatLastN: 2,
  repeatPenalty: 2.2
});



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

  let systemMCPInstructions = `You are a useful AI agent. 
  Your job is to understand the user prompt ans decide if you need to use a tool to run external commands.
  Ignore all things not related to the usage of a tool.
  `

  let userInstructions = `🎲 Rolling 5 dice(s) with 12 faces. 
  Then make a sentence to display the result of the roll dice using <the_result_of_the_roll_dice>.
  `

  let systemChatInstructions = `You are a useful AI agent.
  Your job is to answer the user prompt. If you detect that the user prompt is related to a tool, 
  ignore this part and focus on the other parts
  `

  const rollDiceSchema = z.object({
    numFaces: z.number().describe("number of faces on the dice"),
    numDice: z.number().describe("number of dice to roll"),
  })

  const rollDiceTool = tool(
      null,
      {
        name: "rollDice",
        description: "a function to roll dice",
        schema: rollDiceSchema,
      }
  )

  // Bind the dynamic tools to the LLM instance
  const llmWithTools = llmResult.bindTools([rollDiceTool]);

  // Define the messages to send to the LLM
  var messages = [
    ["system", systemMCPInstructions],
    ["user", userInstructions],
  ];

  // Invoke the LLM with the messages
  let llmOutput = await llmWithTools.invoke(messages);

  // Output the LLM response
  console.log("📦 LLM Output:", llmOutput.tool_calls[0]);

  // Call the tool via MCP with the LLM response
  let result = await mcpClient.callTool({
    name: llmOutput.tool_calls[0].name,
    arguments: llmOutput.tool_calls[0].args,
  });

  // Output the server response
  console.log("✅ Server Response:", result, result.content[0]["text"], "\n");

  messages = [
    ["system", systemChatInstructions],
    ["assistant", `the_result_of_the_roll_dice is ${result.content[0]["text"]}`],
    ["user", userInstructions],
  ]


  const stream = await llmResult.stream(messages)
  for await (const chunk of stream) {
    process.stdout.write(chunk.content)
  }

  // Exit the client
  console.log("\n\n👋 Closing connection...");
  mcpClient.close();
  console.log("🔌 Disconnected!");
}

// Start the client
startClient();

