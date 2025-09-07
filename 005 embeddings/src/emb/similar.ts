/** @format */

import { Embeddings, generateEmbeddings, loadJSONData } from "./main";

// distance similarities
function dotProduct(a: number[], b: number[]) {
  return a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
}

// Angle Similarities
function cosineSimilarity(a: number[], b: number[]) {
  const product = dotProduct(a, b);
  const aMagnitude = Math.sqrt(
    a.map((value) => value * value).reduce((a, b) => a + b, 0)
  );
  const bMagnitude = Math.sqrt(
    b.map((value) => value * value).reduce((a, b) => a + b, 0)
  );
  return product / (aMagnitude * bMagnitude);
}

async function main() {
  const dataWithEmbeddings = loadJSONData<Embeddings[]>(
    "dataWithEmbeddings.json"
  );
  const input = "Cat";
  const inputEmbedding = await generateEmbeddings(input);
  const similarities: {
    input: string;
    similarity: number;
  }[] = [];

  for (const entry of dataWithEmbeddings) {
    const similarity = cosineSimilarity(
      entry.embedding,
      inputEmbedding.data[0].embedding
    );
    similarities.push({
      input: entry.input,
      similarity,
    });
  }
  const sortedSimilarities = similarities.sort(
    (a, b) => b.similarity - a.similarity
  );
  sortedSimilarities.forEach((similarity) => {
    console.log(`${similarity.input}: ${similarity.similarity}`);
  });
}

main();
//OUTPUT (input = animal)
// Dog: 0.8809407299686308
// Cat: 0.8790958114497402
// Elephant: 0.8430909773464813
// Zebra: 0.8387169957553139
// Lion: 0.8312337413626644
// Tiger: 0.8269741717436936
// Kangaroo: 0.825714799984596
// Whale: 0.8233452908979282
// Ant: 0.8231304472138162
// Panda: 0.8186642964905273
// Mosquito: 0.8141950014325721
// Dolphin: 0.813408794698126
// Bee: 0.8087282167263897
// Termite: 0.8069871745917132
// Cactus: 0.798812109438179
// Beetle: 0.7987241033438038
// Fern: 0.7980777906457173
// Dragonfly: 0.7975118712745012
// Butterfly: 0.7956751669524619
// Rose: 0.7950035619455388
// Grasshopper: 0.7945679318881171
// Banana Plant: 0.7902783770884053
// Ladybug: 0.7900778347765143
// Firefly: 0.7886237348003345
// Sunflower: 0.7845425293401859
// Bamboo: 0.7835111768905625
// Lotus: 0.7824636661029944
// Tulip: 0.7667315795122649
// Mango Tree: 0.7665171704283505
// Maple Tree: 0.752099011862621

// Cosine Products (imput = Cat)
// Cat: 1
// Dog: 0.8784574498512115
// Tiger: 0.8469341368686011
// Lion: 0.8400189849968039
// Zebra: 0.8215138254113937
// Panda: 0.8206656250913157
// Ant: 0.8205673025443287
// Elephant: 0.8195798163431167
// Cactus: 0.8179889805221376
// Rose: 0.8155832607743526
// Bee: 0.8126595573396702
// Ladybug: 0.81019331148903
// Dragonfly: 0.8092352580334332
// Lotus: 0.8086043875720015
// Dolphin: 0.8042740716530611
// Beetle: 0.8041362521268806
// Mosquito: 0.8013980064124605
// Butterfly: 0.8004927695652905
// Kangaroo: 0.8000308353017935
// Whale: 0.7997017661695822
// Fern: 0.7981745884516094
// Firefly: 0.7979481415282903
// Grasshopper: 0.7961847730102881
// Termite: 0.7936275918805303
// Sunflower: 0.79180286040378
// Tulip: 0.7874770821123417
// Banana Plant: 0.786675163253818
// Bamboo: 0.7819721899115334
// Mango Tree: 0.7784183565353113
// Maple Tree: 0.7726487483266269
