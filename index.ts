import { RequiredError } from "openai/dist/base";
import { ChatCompletionMessage, SlackEvent } from "./type";
import { getThreadReplies, sendMessage, slackEvents } from "./slack";
import { askQuestion } from "./open-ai";
import { getEnv } from "./config";

slackEvents.on("app_mention", async (event: SlackEvent) => {
  const {
    text,
    channel,
    event_ts: eventTs,
    thread_ts: threadTs,
    files,
  } = event;

  let question = text;
  if (files) {
    question = `${text} - ${files.map((el) => (el as any).url_private)}`;
  }

  const messages: ChatCompletionMessage[] = threadTs
    ? await getThreadReplies(channel, threadTs)
    : [{ role: "user", content: question }];

  try {
    const answer = await askQuestion(messages);

    await sendMessage(channel, answer, eventTs);
  } catch (error) {
    console.error(error);
    const errorMessage = (error as RequiredError).message;

    await sendMessage(channel, errorMessage, eventTs);
  }
});

slackEvents.start(Number(getEnv("PORT")));
console.log("SERVER START")