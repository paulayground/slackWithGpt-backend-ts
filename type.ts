export interface SlackEvent {
  client_msg_id: string;
  type: string;
  text: string;
  user: string;
  ts: string;
  blocks: unknown[];
  team: string;
  channel: string;
  event_ts: string;
  thread_ts?: string;
  files?: unknown[];
}

type ChatCompletionMessageRole = "assistant" | "user";

export interface ChatCompletionMessage {
  role: ChatCompletionMessageRole;
  content: string;
}
