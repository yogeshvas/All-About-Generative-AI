/** @format */

import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const studentInfo = `Rahul Sharma is a third-year undergraduate student pursuing a Bachelor of Technology in Computer Science and Engineering...`;
const clubInfo = `The Tech Innovators Club is one of the most dynamic student-led organizations on campus...`;
const universityInfo = `Greenfield University, established in 1998, is a premier institution recognized for its excellence in education...`;

type Info = {
  info: string;
  refernce: string;
  relevence: number;
};

const dataToEmbed: Info[] = [
  {
    info: studentInfo,
    refernce: "some student 123",
    relevence: 0.9,
  },
  {
    info: clubInfo,
    refernce: "some club 123",
    relevence: 0.8,
  },
  {
    info: universityInfo,
    refernce: "some university 123",
    relevence: 0.9,
  },
];

const pcIndex = pc.index<Info>("new-resumes");
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
async function storeFunction() {
  await Promise.all(
    dataToEmbed.map(async (item, index) => {
      const embeddingResult = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: item.info,
      });

      const embedding = embeddingResult.data[0].embedding;

      await pcIndex.upsert([
        {
          id: `id-${index}`,
          values: embedding,
          metadata: item,
        },
      ]);
    })
  );

  console.log("Data embedded and stored in Pinecone successfully 🚀");
}

async function queryEmbeddings(question: string) {
  const questionWithEmbeddings = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: question,
  });

  const questionEmbedding = questionWithEmbeddings.data[0].embedding;

  const result = await pcIndex.query({
    vector: questionEmbedding,
    topK: 3,
    includeMetadata: true,
    includeValues: true,
  });
  return result;
}

async function askOpenAI(question: string, metadata: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant. Use this info: ${metadata}`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });
  return response.choices[0].message.content;
}

async function main() {
  const question = `what is University of Washington?`;
  const result = await queryEmbeddings(question);
  console.log(result);
  const relevantInfo = result.matches?.[0]?.metadata;
  console.log("Relevant info:", relevantInfo);

  if (relevantInfo) {
    const response = await askOpenAI(question, relevantInfo.info);
    console.log(response);
  }
  // storeFunction().catch(console.error);
}

main();
