import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.api_key);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

async function textToTextModel() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // console.log(model);
  const prompt = "a story about a cat and mouse";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

async function textImagetoTextModel() {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt = "What's different between these pictures?";

  const imageParts = [
    fileToGenerativePart("bat.jpg", "image/jpeg"),
    fileToGenerativePart("sup.jpg", "image/jpeg"),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

async function chat() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: "Hello, I have 2 dogs in my house.",
      },
      {
        role: "model",
        parts: "Great to meet you. What would you like to know?",
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const msg = "How many paws are in my house?";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

async function embedding() {
  // For embeddings, use the embedding-001 model
  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  const text = "The quick brown fox jumps over the lazy dog.";

  const result = await model.embedContent(text);
  const embedding = result.embedding;
  console.log(embedding.values);
}

embedding();
// chat();
// textToTextModel();
// textImagetoTextModel();
