/** @format */

import { ChromaClient } from "chromadb";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

const embeddingFunction = new OpenAIEmbeddingFunction({
  apiKey: process.env.OPENAI_API_KEY || "",
  modelName: "text-embedding-3-small",
});
const client = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false, // true if you're connecting to https
});

async function main() {
  const response = await client.createCollection({
    name: "data-test5",
    embeddingFunction: embeddingFunction, // explicitly tell Chroma no embeddings
  });
  console.log(response);
}

async function addData() {
  const collection = await client.getCollection({ name: "data-test5" });
  const result = await collection.add({
    ids: ["1"],
    documents: ["Here is my entry"],
  });
  console.log(result);
}

addData();
