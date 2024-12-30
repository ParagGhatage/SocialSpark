import fs from 'fs';
import path from 'path';
import DBconnect from "@/components/DB_connect";
import { NextResponse } from 'next/server';  // Import NextResponse for sending responses

export async function POST(req) {
  try {
    // Ensure DB connection and get the db instance
    const db = await DBconnect();

    // Read the JSON file from the correct path
    const filePath = path.join(process.cwd(), 'social-data', 'data.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');

    // Parse JSON data
    const documents = JSON.parse(fileData);

    // Insert documents into the database
    const collection = db.collection("social");
    const inserted = await collection.insertMany(documents);

    console.log(`* Inserted ${inserted.insertedCount} items.`);

    // Return a response
    return NextResponse.json({ message: `${inserted.insertedCount} items inserted` });
  } catch (error) {
    console.error(error);
    // Return error response
    return NextResponse.json({ message: "Error inserting data", error: error.message }, { status: 500 });
  }
}
