import { createClient } from "next-sanity";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "", 
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    useCdn: true,
    apiVersion: "2023-10-10",
});

// Fetch data from Sanity with proper typing
export async function sanityFetch<T>({ query, params = {} }: { query: string; params?: Record<string, unknown> }): Promise<T> {
    return await client.fetch<T>(query, params);
}
