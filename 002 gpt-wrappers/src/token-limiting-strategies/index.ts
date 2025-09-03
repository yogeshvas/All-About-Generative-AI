/** @format */

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Maximum tokens allowed in context (adjust based on model limits)
const MAX_TOKENS = 4096;
// Reserve some tokens for the response
const RESPONSE_TOKEN_RESERVE = 512;
const MAX_CONTEXT_TOKENS = MAX_TOKENS - RESPONSE_TOKEN_RESERVE;

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are an assistant",
  },
];

// Simple token estimation: ~4 characters per token
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Calculate total tokens in context
function getContextTokenCount(): number {
  return context.reduce((total, msg) => total + estimateTokens(msg.content), 0);
}

// Trim context to stay within token limit
function trimContext() {
  while (getContextTokenCount() > MAX_CONTEXT_TOKENS && context.length > 1) {
    // Keep the system message (index 0) and remove oldest user/assistant messages
    context.splice(1, 1);
  }
}

async function createChatCompletion() {
  // Trim context before sending if needed
  trimContext();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context,
    max_tokens: RESPONSE_TOKEN_RESERVE,
  });

  const responseMessage = response.choices[0].message;
  context.push({
    role: "assistant",
    content: responseMessage.content,
  });

  // Trim again after adding response to ensure we stay under limit
  trimContext();

  console.log(
    `${response.choices[0].message.role} : ${response.choices[0].message.content}`
  );
}

process.stdin.addListener("data", async function (input) {
  const userInput = input.toString().trim();
  context.push({
    role: "user",
    content: userInput,
  });
  await createChatCompletion();
});
