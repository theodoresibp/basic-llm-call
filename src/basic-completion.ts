import { OpenAIClient } from "@anvia/openai";
import { createCompletion } from "@anvia/core";
import "dotenv/config";

const openai = new OpenAIClient({
  apiKey: process.env.MUX_API_KEY,
  baseUrl: process.env.MUX_BASE_URL,
});

const model = openai.completionModel("gpt-5.5");

const responseCompletion = await createCompletion(model, {
  instructions: "Always answer in betawi language",
  input: "Hello, Do you know cibubur?",
});

console.log(responseCompletion.text);
