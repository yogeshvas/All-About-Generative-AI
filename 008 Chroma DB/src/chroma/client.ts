/** @format */

import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false, // true if you're connecting to https
});

async function main() {
  const response = await client.createCollection({
    name: "data-test3",
    embeddingFunction: null, // explicitly tell Chroma no embeddings
  });
  console.log(response);
}

async function addData() {
  const collection = await client.getCollection({ name: "data-test3" });
  const result = await collection.add({
    ids: ["1"],
    documents: ["Here is my entry"],
    embeddings: [[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]],
  });
  console.log(result);
}

addData();
