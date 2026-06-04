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
            <div class="bot-avatar">✈</div>
            <div class="bot-info">
              <div class="bot-name">SkyAssist</div>
              <div class="bot-status"><span class="dot"></span> Online</div>
            </div>
            <button class="close-btn" (click)="toggle()">✕</button>
          </div>

          <div class="messages" #msgContainer>
            @for (msg of chat.messages(); track msg.id) {
              <div class="msg" [class.bot]="msg.isBot" [class.user]="!msg.isBot">
                @if (msg.isBot) {
                  <div class="avatar">✈</div>
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
              <div class="msg bot">
                <div class="avatar">✈</div>
                <div class="bubble typing">
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
              ➤
            </button>
          </div>
        </div>
      }

      <!-- Toggle button -->
      <button class="toggle-btn" (click)="toggle()" [class.open]="isOpen()">
        @if (isOpen()) { <span>✕</span> } @else { <span>✈</span> }
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
