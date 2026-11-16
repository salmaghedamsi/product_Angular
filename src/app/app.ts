import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgentService } from './agent';   // si ton fichier s'appelle agent.ts, écris './agent'

interface Message {
  role: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {                                  // garde le nom de ta classe actuelle
  private agent = inject(AgentService);

  messages = signal<Message[]>([
    { role: 'bot', text: 'Bonjour ! Posez-moi vos questions sur le catalogue.' }
  ]);
  busy = signal(false);       // true pendant que l'agent répond
  seconds = signal(0);        // compteur affiché pendant l'attente
  input = '';                 // texte tapé dans le champ

  ask(question: string) {
    const q = question.trim();
    if (!q || this.busy()) return;

    this.messages.update(m => [...m, { role: 'user', text: q }]);
    this.input = '';
    this.busy.set(true);
    this.seconds.set(0);
    const timer = setInterval(() => this.seconds.update(s => s + 1), 1000);

    this.agent.ask(q).subscribe({
      next: (text) => {
        this.messages.update(m => [...m, { role: 'bot', text }]);
        this.finish(timer);
      },
      error: (err) => {
        const text = err.status === 429
          ? '⏳ ' + err.error
          : "Impossible de joindre l'agent.";
        this.messages.update(m => [...m, { role: 'bot', text }]);
        this.finish(timer);
      }
    });
  }

  private finish(timer: any) {
    clearInterval(timer);
    this.busy.set(false);
  }
}