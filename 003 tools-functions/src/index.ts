/** @format */

import OpenAI from "openai";

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// local tool function
function getTimeOfDay() {
  return "5:45";
}

async function callOpenAIWithTools() {
  const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant that gives information about the time of the day.",
    },
    {
      role: "user",
      content: "What is the time of our day?",
    },
  ];

  // First call to OpenAI with the tool definition
  const response = await openAI.chat.completions.create({
    model: "gpt-4o-mini",
    messages: context,
    tools: [
      {
        type: "function",
        function: {
          name: "getTimeOfDay",
          description: "Get the current time of day",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const choice = response.choices[0];

  // check if tool call is needed
  if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
    const toolCall = choice.message.tool_calls[0];
    const toolName = toolCall.function.name;

    let toolResult: string | null = null;

    if (toolName === "getTimeOfDay") {
      toolResult = getTimeOfDay();
    }

    // Now call OpenAI again with the tool’s response
    const finalResponse = await openAI.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...context,
        choice.message, // the model’s request to call the tool
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolResult,
        },
      ],
    });

    console.log("Assistant:", finalResponse.choices[0].message.content);
  } else {
    // No tool call, directly return response
    console.log("Assistant:", choice.message.content);
  }
}

callOpenAIWithTools();
