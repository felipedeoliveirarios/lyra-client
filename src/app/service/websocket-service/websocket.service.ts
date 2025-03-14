import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retry, share, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  private socket$: WebSocketSubject<any> | null = null;
  private messagesSubject = new Subject<any>();
  private disconnect$ = new Subject<void>();

  public messages$: Observable<any> = this.messagesSubject.asObservable().pipe(share());

  constructor() {}

  connect(url: string): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(url);

      this.socket$.pipe(
        takeUntil(this.disconnect$),
        retry({ delay: 3000 }) // Auto-reconnect after 3 seconds

      ).subscribe({
        next: (message) => this.messagesSubject.next(message),
        error: (err) => console.error('WebSocket error:', err),
        complete: () => console.log('WebSocket closed')
      });
    }
  }

  sendMessage(message: any): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(message);

    } else {
      console.warn('WebSocket is not connected.');
    }
  }

  close(): void {
    this.disconnect$.next();
    this.socket$?.complete();
    this.socket$ = null;
  }
}
