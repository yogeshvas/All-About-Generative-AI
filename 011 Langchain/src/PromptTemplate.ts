/** @format */

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  model: "gpt-4-mini",
  temperature: 0.7,
});

async function formTemplate() {
  const promptMessage = ChatPromptTemplate.fromTemplate(
    `Write a small description about the following product - {product_name}`
  );
  // const wholePrompt = await promptMessage.format({ product_name: "Shoes" });

  //creating the chain
  const chain = promptMessage.pipe(model);
  const response = await chain.invoke({ product_name: "Adidas Shoes" });
  console.log(response.content);
}
async function fromMessage() {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "write a small description about the following product provided by user",
    ],
    ["user", "{product_name}"],
  ]);
  const chain = prompt.pipe(model);
  const response = await chain.invoke({ product_name: "Adidas Shoes" });
  console.log(response.content);
}
