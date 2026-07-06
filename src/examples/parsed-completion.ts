import { OpenAIClient } from "@anvia/openai";
import { createParsedCompletion } from "@anvia/core";
import "dotenv/config";
import { z } from "zod";

const openai = new OpenAIClient({
  apiKey: process.env.MUX_API_KEY,
  baseUrl: process.env.MUX_BASE_URL,
});

const model = openai.completionModel("gpt-5.5");

const eventSchema = z.object({
  title: z.string(),
  date: z.string(),
  location: z.string(),
});

const responseParsedCompletion = await createParsedCompletion(model, {
  instructions: "Extract the user data, always answer in javanese language",
  input:
    "Hello, Do you know Kledokan? on wednesday i want to meet velo and sera at 10am there",
  schema: eventSchema,
});

console.log(responseParsedCompletion.data);
