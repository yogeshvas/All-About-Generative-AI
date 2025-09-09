/** @format */

import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// string value
// string database
// metadata - more info

function getIndex() {
  const index = pc.index("resumes");
  return index;
}

function generateNumbersArray(length: number) {
  return Array.from({ length }, () => Math.random());
}
async function upsertVectors() {
  const embedding = generateNumbersArray(1024);
  const index = getIndex();
  const upsertResult = await index.upsert([
    {
      id: "id-1",
      values: embedding,
      metadata: { name: "Yogesh Vashisth" },
    },
  ]);
  console.log(upsertResult);
}

async function queryVectors() {
  const index = getIndex();
  const result = await index.query({
    id: "id-1",
    topK: 1,
    includeMetadata: true,
    includeValues: true,
  });
  console.log(result.matches.toString());
}
async function listIndexes() {
  const indexes = await pc.listIndexes();
  console.log(indexes);
}

async function createIndex() {
  await pc.createIndexForModel({
    name: "resumes",
    cloud: "aws",
    region: "us-east-1",
    embed: {
      model: "llama-text-embed-v2",
      fieldMap: { text: "chunk_text" },
      metric: "cosine",
    },
    waitUntilReady: true,
  });
}
async function main() {
  queryVectors();
}

main();
