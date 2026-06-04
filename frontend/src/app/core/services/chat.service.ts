import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChatMessage, ChatResponse } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly API = `${environment.apiUrl}/api/chat`;
  private _sessionId = Math.random().toString(36).substring(2);

  messages = signal<ChatMessage[]>([
    {
      id: '0',
      text: "Welcome to SkyLux! ✈️ I'm SkyAssist, your personal travel companion. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
      quickReplies: ['Search Flights', 'My Bookings', 'Cancellation Policy', 'Baggage Info']
    }
  ]);

  constructor(private http: HttpClient) {}

  sendMessage(text: string) {
    // Optimistic user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2),
      text,
      isBot: false,
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, userMsg]);

    return this.http.post<ChatResponse>(`${this.API}/message`, {
      message: text,
      sessionId: this._sessionId
    });
  }

  addBotMessage(response: ChatResponse) {
    const botMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2),
      text: response.message,
      isBot: true,
      timestamp: new Date(),
      quickReplies: response.quickReplies ?? []
    };
    this.messages.update(msgs => [...msgs, botMsg]);
  }

  clearMessages() {
    this.messages.set([]);
  }
}
