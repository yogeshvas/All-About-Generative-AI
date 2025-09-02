/** @format */

import OpenAI from "openai";

const client = new OpenAI();

async function start() {
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: "What are webhooks?",
  });
  console.log(response.output_text);
}

start();
