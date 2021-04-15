import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor() { }

  private connectionAlive = false;

  private hubUrl = `${environment.api.baseUrl}/DemoStatus`;
  private hubConnection: signalR.HubConnection;

  public startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.hubUrl).build();

    return this.hubConnection.start().then(() => {
      console.log('connection started');
      this.connectionAlive = true;
    }).catch((error) => {
      console.log(`Error while starting connection ${error}`);
    });
  }

  public addDemoStateListener(func: (data) => void): void {
    this.hubConnection.on('DemoStatus', (data) => func(data));
  }

  public addRestartListener(func: () => void): void {
    this.hubConnection.on('Restart', () => func());
  }

  public addPredictiveListener(func: () => void): void {
    this.hubConnection.on('PredictiveChange', () => func());
  }

  public addToggleListener(func: () => void): void {
    this.hubConnection.on('TogglePredictive', () => func());
  }

  public callRemoteProcedure(procedure: string): void {
    this.hubConnection.invoke(procedure).catch((error) => {
      console.log(`Error while calling ${procedure}: ${error}`);
    });
  }

}
