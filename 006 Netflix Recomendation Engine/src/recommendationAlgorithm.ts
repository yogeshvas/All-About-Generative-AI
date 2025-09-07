/** @format */

import { Embeddings, generateEmbeddings, loadJSONData } from "./main";

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

console.log("What Movie you want to watch?");
console.log("...............");
process.stdin.addListener("data", async function (input) {
  const userInput = input.toString().trim();
  await getRecommendation(userInput);
});

async function getRecommendation(input: string) {
  const dataWithEmbeddings = loadJSONData<Embeddings[]>(
    "dataWithEmbeddings.json"
  );
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
      input: entry.text,
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

// OUTPUT

// What Movie you want to watch?
// ...............
// Data saved to dataWithEmbeddings.json
// I want to see science Movie^[[D^[[D^[[D^[[D^[[D^[[D^C
// yogeshvashisth@Yogeshs-MacBook-Air 006 Netflix Recomendation Engine % npm start

// > 006-netflix-recomendation-engine@1.0.0 start
// > node -r ts-node/register --env-file=.env src/recommendationAlgorithm.ts

// What Movie you want to watch?
// ...............
// ^C
// yogeshvashisth@Yogeshs-MacBook-Air 006 Netflix Recomendation Engine % clear
// yogeshvashisth@Yogeshs-MacBook-Air 006 Netflix Recomendation Engine % npm start

// > 006-netflix-recomendation-engine@1.0.0 start
// > node -r ts-node/register --env-file=.env src/recommendationAlgorithm.ts

// What Movie you want to watch?
// ...............
// Data saved to dataWithEmbeddings.json
// Science Movie
// Title: The Cosmic Journey
// Genres: Sci-Fi, Adventure
// Description: A group of astronauts embarks on a mission to explore a newly discovered planet, uncovering secrets that challenge their understanding of the universe.
// Year: 2023
// Rating: 8.2: 0.8157098172847794
// Title: Space Pirates
// Genres: Sci-Fi, Action, Comedy
// Description: A ragtag crew of misfits embarks on a heist to steal a valuable artifact from a heavily guarded space station.
// Year: 2023
// Rating: 6.8: 0.7989098044156372
// Title: Love in the Time of Pixels
// Genres: Romance, Drama
// Description: Two strangers meet in a virtual reality world and form a deep connection, but struggle to maintain their bond in the real world.
// Year: 2024
// Rating: 7.8: 0.7738988585597123
// Title: The Last Firewall
// Genres: Action, Thriller, Sci-Fi
// Description: A rogue hacker must stop an AI from taking over the global internet in a high-stakes cyber battle.
// Year: 2022
// Rating: 6.9: 0.7695336510011079
// Title: Mysteries of the Old Town
// Genres: Mystery, Drama
// Description: A detective investigates a series of disappearances in a quaint town, revealing dark secrets hidden for decades.
// Year: 2021
// Rating: 7.5: 0.7668618378525676
// Title: Echoes of Eternity
// Genres: Fantasy, Adventure
// Description: A young warrior discovers a magical artifact that could save or destroy their kingdom, forcing them to confront their destiny.
// Year: 2024
// Rating: 8: 0.7661081620762774
// Title: Neon Nights
// Genres: Crime, Thriller
// Description: A private investigator navigates the gritty underworld of a futuristic city to uncover a conspiracy threatening its core.
// Year: 2022
// Rating: 7.3: 0.7610060235158922
// Title: Laugh Riot
// Genres: Comedy
// Description: A struggling comedian accidentally becomes an internet sensation, leading to chaotic and hilarious misadventures.
// Year: 2023
// Rating: 6.5: 0.7579967636619932
// Title: The Forgotten Song
// Genres: Romance, Fantasy
// Description: A musician discovers an ancient melody that can alter reality, but using it comes at a steep personal cost.
// Year: 2024
// Rating: 8.5: 0.7566905725896635
// Title: Family Ties
// Genres: Drama, Family
// Description: A multigenerational family reunites for a holiday, confronting old wounds and rediscovering their love for each other.
// Year: 2021
// Rating: 7.7: 0.7542251209326406
