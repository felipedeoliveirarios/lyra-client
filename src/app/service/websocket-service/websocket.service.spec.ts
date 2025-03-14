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

    webSocketService.connect('wss://ws.postman-echo.com/raw');

    webSocketService.messages$.subscribe((receivedMessage) => {
      expect(receivedMessage).toEqual(testMessage);
      console.log('Message Received: ', receivedMessage);
      webSocketService.close();
      done();
    });

    setTimeout(() => {
      console.log('Sending message: ', testMessage);
      webSocketService.sendMessage(testMessage);
    }, 500);
  });

  afterEach(() => {
    webSocketService.close();
  });
});
