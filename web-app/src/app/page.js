"use client";
import { useState } from "react";

// Langflow Client Class
class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });

            const responseMessage = await response.json();
            if (!response.ok) {
                throw new Error(
                    `${response.status} ${response.statusText} - ${JSON.stringify(
                        responseMessage
                    )}`
                );
            }
            return responseMessage;
        } catch (error) {
            console.error("Request Error:", error.message);
            throw error;
        }
    }

    async initiateSession({
        flowId,
        langflowId,
        inputValue,
        inputType = "chat",
        outputType = "chat",
        stream = false,
        tweaks = {},
    }) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, {
            input_value: inputValue,
            input_type: inputType,
            output_type: outputType,
            tweaks,
        });
    }
}

export default function LangflowPage() {
    const [inputValue, setInputValue] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const flowId = `${process.env.FLOW_ID}`; // Replace with your flow ID
        const langflowId = `${process.env.LANGFLOW_ID}`; // Replace with your langflow ID
        const applicationToken = `${process.env.ASTRA_TB}`; // Replace with your token

        const client = new LangflowClient(
            "/api",  // This now points to the local proxy
            applicationToken
        );

        try {
            const tweaks = {
                "ChatInput-073Tt": {},
                "ParseData-mCy7e": {},
                "Prompt-93j0x": {},
                "SplitText-Z7voJ": {},
                "OpenAIModel-BN18p": {},
                "ChatOutput-t8Q26": {},
                "AstraDB-hH1wY": {},
                "OpenAIEmbeddings-zTo4y": {},
                "AstraDB-1j3J3": {},
                "OpenAIEmbeddings-8XNb0": {},
                "File-X78mx": {},
            };

            const result = await client.initiateSession({
                flowId,
                langflowId,
                inputValue,
                inputType: "chat",
                outputType: "chat",
                stream: false,
                tweaks,
            });
            setResponse(result.outputs[0].outputs[0].results.message.data.text);
            console.log(response)
        } catch (err) {
            console.error("Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">SocialSpark</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="mt-6">
    <label className="block text-lg font-semibold mb-2" htmlFor="postType">Choose Post Type</label>
    <select
        id="postType"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 shadow-sm"
    >
        <option value="" disabled>Select a Post Type</option>
        <option value="carousel">Carousel</option>
        <option value="reels">Reels</option>
        <option value="static">Static Images</option>
    </select>
</div>

                <button
                    type="submit"
                    className="p-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                    Submit
                </button>
            </form>

            {loading && <p className="mt-4 text-center text-gray-500">Loading...</p>}
            {error && <p className="mt-4 text-center text-red-500">Error: {error}</p>}
            {response && (
    <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Response:</h3>
        <div
            className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-800"
            dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }}
        />
    </div>
)}

        </div>
    );
}
