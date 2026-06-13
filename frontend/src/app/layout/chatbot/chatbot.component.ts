import { Component, ElementRef, signal, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="chatbot-wrap">
      <!-- Panel -->
      @if (isOpen()) {
        <div class="chatbot-panel">
          <div class="panel-header">
            <!-- SVG plane avatar -->
            <div class="bot-avatar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
              </svg>
            </div>
            <div class="bot-info">
              <div class="bot-name">SkyAssist AI</div>
              <div class="bot-status"><span class="dot"></span> Online &amp; ready</div>
            </div>
            <div class="header-actions">
              <button class="action-btn" title="Clear chat" (click)="chat.clearMessages()">⊘</button>
            </div>
            <button class="close-btn" (click)="toggle()">✕</button>
          </div>

          <div class="messages" #msgContainer>
            @for (msg of chat.messages(); track msg.id) {
              <div class="msg" [class.bot]="msg.isBot" [class.user]="!msg.isBot">
                @if (msg.isBot) {
                  <div class="avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
                    </svg>
                  </div>
                }
                <div class="bubble">
                  <pre>{{ msg.text }}</pre>
                  <span class="ts">{{ msg.timestamp | date:'HH:mm' }}</span>
                </div>
              </div>
              @if (msg.isBot && msg.quickReplies?.length) {
                <div class="quick-replies">
                  @for (qr of msg.quickReplies; track qr) {
                    <button class="chip" (click)="sendQuick(qr)">{{ qr }}</button>
                  }
                </div>
              }
            }
            @if (isTyping()) {
              <div class="msg bot typing">
                <div class="avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="bubble">
                  <span></span><span></span><span></span>
                </div>
              </div>
            }
          </div>

          <div class="input-area">
            <input
              [(ngModel)]="inputText"
              (keyup.enter)="send()"
              placeholder="Ask me anything…"
              [disabled]="isTyping()"
            />
            <button class="send-btn" (click)="send()" [disabled]="!inputText.trim() || isTyping()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12 2 3v7l15 2-15 2v7z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      }

      <!-- Toggle button -->
      <button class="toggle-btn" (click)="toggle()" [class.open]="isOpen()">
        @if (isOpen()) {
          <span>✕</span>
        } @else {
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
          </svg>
        }
      </button>
    </div>
  `,
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('msgContainer') msgContainer!: ElementRef;

  isOpen = signal(false);
  isTyping = signal(false);
  inputText = '';

  constructor(public chat: ChatService) {}

  toggle() { this.isOpen.update(v => !v); }

  send() {
    const text = this.inputText.trim();
    if (!text || this.isTyping()) return;
    this.inputText = '';
    this.isTyping.set(true);

    this.chat.sendMessage(text).subscribe({
      next: res => {
        this.isTyping.set(false);
        this.chat.addBotMessage(res);
      },
      error: () => {
        this.isTyping.set(false);
        this.chat.addBotMessage({ message: "Sorry, I'm having trouble connecting. Please try again.", type: 'text' });
      }
    });
  }

  sendQuick(text: string) {
    this.inputText = text;
    this.send();
  }

  ngAfterViewChecked() {
    if (this.msgContainer) {
      const el = this.msgContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
