import {OpenAIClient} from "@anvia/openai"
import {createCompletion,createParsedCompletion,createCompletionStream} from "@anvia/core"
import "dotenv/config"
import { z } from "zod";

const openai = new OpenAIClient({
  apiKey: process.env.MUX_API_KEY,
  baseUrl: process.env.MUX_BASE_URL,
});

const eventSchema = z.object({
  title: z.string(),
  date: z.string(),
  location: z.string(),
});

const model = openai.completionModel("gpt-5.5");


const responseCompletion = await createCompletion(model, {
  instructions: "Always answer in betawi language",
  input: "Hello, Do you know cibubur?",
  
});

const responseParsedCompletion = await createParsedCompletion(model, {
  instructions: "Extract the user data, always answer in javanese language",
  input: "Hello, Do you know Kledokan? on wednesday i want to meet velo and sera at 10am there",
  schema: eventSchema,
});

//console.log(responseCompletion.text);
//console.log(responseParsedCompletion.data);

const responseCompletionStream = await createCompletionStream(model, {
  instructions: "you are a helpful assistant that can answer questions about the 90s",
  input: "Hello, Do you know cibubur on 90s?",
});

for await (const chunk of responseCompletionStream) {
  if (chunk.type === "text_delta") {
    process.stdout.write(chunk.delta);
  }
}



