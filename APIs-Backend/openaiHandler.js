import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (symptoms) {
  if (!configuration.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md");
  }

  if (symptoms.length === 0) {
    throw new Error("Please enter valid symptoms");
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Mi paciente tiene los siguientes síntomas: ${symptoms}. ¿podrias contestarme en una palabra (que se pueda usar en 'https') que podria ser?`,
      temperature: 0.7,
      max_tokens: 100,
      // n: 1,
      // stop: ["\n"],
    });
    console.log(completion.data.choices);
    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    throw error;
  }
}
