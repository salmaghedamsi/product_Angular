import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);

  ask(message: string): Observable<string> {
    return this.http.get('/agent', {
      params: { message },
      responseType: 'text'
    });
  }
}