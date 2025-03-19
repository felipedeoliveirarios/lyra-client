import {TestBed} from '@angular/core/testing';
import {WebSocketService} from './websocket.service';

describe('WebSocketService (Integration Test)', () => {
  let webSocketService: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService]
    });

    webSocketService = TestBed.inject(WebSocketService);
  });

  it('should establish a WebSocket connection and echo messages', (done) => {
    const testMessage = {
      timestamp: new Date().toISOString(),
      eventType: 'testEvent'
    };

    webSocketService.connect('ws://localhost:5000');

    webSocketService.messages$.subscribe({
      next: (receivedMessage) => {
        console.log(new Date().toISOString(), 'Message Received: ', receivedMessage);

        if ("" + receivedMessage == "" + testMessage) {
          console.log("Received the expected message.");
          console.log(new Date().toISOString(), 'Closing websocketService... ');
          webSocketService.close();
          done();
        }
      },
      error: (e) => console.error(new Date().toISOString(), e),
      complete: () => {}
    });

    setTimeout(() => {
      console.log(new Date().toISOString(), 'Sending message: ', testMessage);
      webSocketService.sendMessage(testMessage);
    }, 500);
  });
});
