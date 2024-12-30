import { DataAPIClient } from "@datastax/astra-db-ts";

export default async function DBconnect() {
  try {
    // Initialize the client with your AstraDB token
    const client = new DataAPIClient('AstraCS:zAqPuWBioSggQqNJqhwgPTQH:02b61e5a6f6fc2cd2189d6c29d66a311dc1528ee98d9e3ccb71e4c2c83d1f37a');

    // Connect to your Astra DB instance
    const db = client.db('https://3cf7c373-0cfb-4bf3-80f9-8d2ffdcf65ae-us-east-2.apps.astra.datastax.com');

    // List collections to confirm the connection is successful
    const colls = await db.listCollections();
    console.log('Connected to AstraDB:', colls);

    // Return the database instance for further use
    return db;
  } catch (error) {
    console.error("Error connecting to AstraDB:", error);
    throw new Error("Failed to connect to AstraDB");
  }
}
