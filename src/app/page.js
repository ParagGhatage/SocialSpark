"use client"
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState(""); // State for content type selection

  // Handle content type change
  function handleContentTypeChange(event) {
    setSelectedContentType(event.target.value);
  }

  // Insert data function
  async function handleInsert() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/astra-db/insert-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Add any data you need to insert
        }),
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error inserting data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Get data function based on content type selection
  async function handleGetData() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/astra-db/get-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedContentType, // Send selected content type
        }),
      });
      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error("Error getting data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {/* Button to insert data */}
      <button
        className="bg-white text-black"
        onClick={handleInsert}
        disabled={isLoading}
      >
        {isLoading ? "Inserting..." : "Insert Data"}
      </button>

      {/* Select dropdown for content type */}
      <select
        className="bg-white text-black"
        value={selectedContentType}
        onChange={handleContentTypeChange}
        disabled={isLoading}
      >
        <option value="">Select Content Type</option>
        <option value="Carousel">Carousel</option>
        <option value="Reels">Reels</option>
        <option value="Static">Static</option>
      </select>

      {/* Button to get data */}
      <button
        className="bg-white text-black"
        onClick={handleGetData}
        disabled={isLoading || !selectedContentType} // Disable if no content type is selected
      >
        {isLoading ? "Loading..." : "Get Data"}
      </button>
    </div>
  );
}
