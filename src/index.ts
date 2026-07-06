import {OpenAIClient} from "@anvia/openai"
import {createCompletionStream, Message} from "@anvia/core"
import "dotenv/config"
import { input,select } from "@inquirer/prompts";

const openai = new OpenAIClient({
  apiKey: process.env.MUX_API_KEY,
  baseUrl: process.env.MUX_BASE_URL,
});

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

