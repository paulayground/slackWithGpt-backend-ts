import { Configuration, OpenAIApi } from "openai";
import { getEnv } from "./config";
import { ChatCompletionMessage } from "./type";

const openai = new OpenAIApi(
  new Configuration({ apiKey: getEnv("OPEN_AI_API_KEY") })
);

export async function askQuestion(messages: ChatCompletionMessage[]) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });

  const answer =
    response.data.choices[0].message?.content ?? "답변이 없습니다.";

  return answer;
}
