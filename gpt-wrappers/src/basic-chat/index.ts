/** @format */

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

process.stdin.addListener("data", async function (input) {
  const userInput = input.toString().trim();

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: userInput,
      },
    ],
  });

  console.log(response.choices[0].message.content);
});
