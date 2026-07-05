import {OpenAIClient} from "@anvia/openai"
import {createCompletion,createParsedCompletion,createCompletionStream, Message} from "@anvia/core"
import "dotenv/config"
//import { z } from "zod";
import { input,select } from "@inquirer/prompts";

const openai = new OpenAIClient({
  apiKey: process.env.MUX_API_KEY,
  baseUrl: process.env.MUX_BASE_URL,
});


// const eventSchema = z.object({
//   title: z.string(),
//   date: z.string(),
//   location: z.string(),
// });

 //const model = openai.completionModel("gpt-5.5");

// const responseCompletion = await createCompletion(model, {
//   instructions: "Always answer in betawi language",
//   input: "Hello, Do you know cibubur?",
  
// });

// const responseParsedCompletion = await createParsedCompletion(model, {
//   instructions: "Extract the user data, always answer in javanese language",
//   input: "Hello, Do you know Kledokan? on wednesday i want to meet velo and sera at 10am there",
//   schema: eventSchema,
// });

//console.log(responseCompletion.text);
//console.log(responseParsedCompletion.data);

const memoryMessages: Message[] = [];

const gpt5_5 = openai.completionModel("gpt-5.5");
const glm_5_2 = openai.completionModel("glm-5.2");

async function main() {

  const selectedModel = await select({
    message: "Select a model",
    choices: [{name: "gpt-5.5", value: gpt5_5}, {name: "glm-5.2", value: glm_5_2}],
  });

  while (true) {
    const userInput = await input({ message: "You: " });
    if (userInput === "exit") {
      break;
    }

    memoryMessages.push(Message.user(userInput));

    const responseCompletionStream =  createCompletionStream(selectedModel, {
      instructions: "you are a helpful assistant, please answer in javanese krama language",
      input: userInput,
      messages: memoryMessages,
    });

    let assistentMessage = "";

    console.log("Assistant: ");
    for await (const chunk of responseCompletionStream) {
      if (chunk.type === "text_delta") {
        process.stdout.write(chunk.delta);
        assistentMessage += chunk.delta;
      }
    }
    console.log();
    memoryMessages.push(Message.assistant(assistentMessage));
  }




}

main();

