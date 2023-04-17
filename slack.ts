import { WebClient } from "@slack/web-api";
import { createEventAdapter } from "@slack/events-api";
import { getEnv } from "./config";
import { ChatCompletionMessage } from "./type";

// .env에 저장되어 있는 Slack app 세팅을 가져옵니다.
const slackBotToken = getEnv("SLACK_BOT_TOKEN");
const slackAppSecret = getEnv("SLACK_SIGNING_SECRET");

// Slack Web API 클라이언트를 초기화합니다.
const web = new WebClient(slackBotToken);

// Slack 이벤트 어댑터를 생성합니다.
export const slackEvents = createEventAdapter(slackAppSecret);

// Slack 메시지를 보내는 함수입니다.
export async function sendMessage(
  channel: string,
  content: string,
  threadTimestamp: string
): Promise<void> {
  await web.chat.postMessage({
    channel,
    text: content,
    thread_ts: threadTimestamp,
  });
}

// 스레드의 전체 메시지를 가져오는 함수입니다.
export async function getThreadReplies(
  channelId: string,
  threadTs: string
): Promise<ChatCompletionMessage[]> {
  const replies = await web.conversations.replies({
    channel: channelId,
    ts: threadTs,
  });

  // messages property가 undefined인 경우 빈 배열을 반환합니다.
  const messages = replies.messages;
  if (!messages) {
    return [];
  }

  return messages.map(
    (message): ChatCompletionMessage => ({
      role: isBot(message.bot_id) ? "assistant" : "user",
      content: message.text ?? "",
    })
  );
}

// 메시지가 bot에 의해 작성되었는지 여부를 결정하는 함수입니다.
function isBot(botId?: string) {
  return botId ? true : false;
}
