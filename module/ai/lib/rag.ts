import { pineconeIndex } from "../../../lib/pinecone";
import { google } from "@ai-sdk/google";
import { embedMany } from "ai";

// 1. Accepts an array of strings to batch requests and explicitly returns a 2D array
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: google.embedding("gemini-embedding-001"),
    values: texts,
    providerOptions: {
      google: {
        outputDimensionality: 1024, // Matches your Pinecone index dimension configuration
      },
    },
  });
  return embeddings;
}

export async function indexCodebase(
  repoId: string,
  files: { path: string; content: string }[],
) {
  if (files.length === 0) return;

  // 2. Pre-process and truncate all file contents into a single array
  const processedContents = files.map((file) => {
    const content = `File: ${file.path}\n\n${file.content}`;
    return content.slice(0, 10000);
  });

  try {
    // 3. Batch fetch all embeddings in a single network request to avoid rate limits
    const embeddings = await generateEmbeddings(processedContents);

    // 4. Map the files into properly structured Pinecone records
    const vectors = files.map((file, index) => {
      const singleEmbedding = embeddings[index] as number[]; // Extract 1D array

      return {
        id: `${repoId}-${file.path}`,
        values: singleEmbedding,
        metadata: {
          repoId: repoId,
          path: file.path,
          content: processedContents[index],
        },
      };
    });

    // 5. Upsert into Pinecone using chunked batches
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await pineconeIndex.upsert({ records: batch });
    }

    console.log("Indexing completed successfully.");
  } catch (error) {
    console.error("Error indexing codebase:", error);
    throw error;
  }
}

export async function retrieveContext(
  query: string,
  repoId: string,
  topK: number = 5,
) {
  // 6. Wrap the single query string in an array, then extract the resulting 1D vector
  const [vector] = await generateEmbeddings([query]);


  const results = await pineconeIndex.query({
    vector: vector,
    filter: {
      repoId: repoId,
    },
    topK: topK,
    includeMetadata: true,
  });

  return results.matches
    ? results.matches
        .map((match) => match.metadata?.content as string)
        .filter(Boolean)
    : [];
}
