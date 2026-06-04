export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickReplies?: string[];
}

export interface ChatResponse {
  message: string;
  type: string;
  flightResults?: any[];
  quickReplies?: string[];
}
