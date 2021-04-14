import { Component } from '@angular/core';
import { SignalRService } from './services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'droneFrontend';

  constructor(private signalR: SignalRService) {
    signalR.startConnection().then(() => {
      signalR.callRemoteProcedure('GetStatus');
    });
  }
}
