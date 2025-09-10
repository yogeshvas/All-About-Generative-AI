/** @format */

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document"; // ✅ correct import
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
});

const myData = [
  "My name is John",
  "My name is Bob",
  "My favourite food is pizza",
  "My favourite food is pasta",
];

const question = "What are my favourite food?";

async function main() {
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

  await vectorStore.addDocuments(
    myData.map(
      (content, i) =>
        new Document({
          pageContent: content,
          metadata: { id: i },
        })
    )
  );

  const retriver = vectorStore.asRetriever({ k: 2 });
  const results = await retriver.getRelevantDocuments(question);
  const resultDocument = results.map((results) => results.pageContent);
  // build template
  const template = ChatPromptTemplate.fromMessages([
    "system",
    "Answer the user question based on following question context - {context}",
    ["user", "{input}"],
  ]);
  const chain = template.pipe(model);
  const response = await chain.invoke({
    input: question,
    content: resultDocument,
  });
  console.log(response.content);
}

main();
