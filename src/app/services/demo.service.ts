import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DroneService } from './drone.service';
import { FeedsService } from './feeds.service';
import { PredictiveService } from './predictive.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { Drone } from '../models/drone.model';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DemoService extends ApiBaseService<string, string> {
  constructor(
    protected toastService: ToastrService,
    protected feedsService: FeedsService,
    protected httpClient: HttpClient,
    protected predictiveService: PredictiveService,
    protected droneService: DroneService
  ) {
    super(`${environment.api.baseUrl}/demo`, httpClient, toastService);
  }

  public isDemoLive = false;
  public isDemoStarted = false;
  public btnTxt = toggleDemoBtnTxt[0];

  public logs: string[] = [];

  public toggleDrones(ext: string): void {
    this.postDemoToggle(ext).pipe(take(1)).subscribe();
  }

  public restartDrones(): void {
    this.toggleDrones('false');
    this.delete().pipe(take(1)).subscribe();
  }

  public addMapClickToLog(lat: number, lng: number) {
    this.logs.push('MapClick: ' + this.getTimestamp() + ' | ' + lat + ', ' + lng);
  }

  private getTimestamp() {
    const now: Date = new Date();
    return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds();
  }

  public displayLogs() {
    console.log(this.logs);
  }

  public toggleStartDemo(): void {
    if (this.isDemoLive) this.pauseDemo();
    else this.startDemo();
  }

  public startDemo(): void {
    this.feedsService.startFeeds();
    this.isDemoLive = true;
    this.isDemoStarted = true;
    this.toggleDrones('true');
    this.toastService.success(
      'The demo has successfully started',
      'Demo Started!'
    );
    this.btnTxt = toggleDemoBtnTxt[1];
    this.logs.push('DemoStart: ' + this.getTimestamp());

    this.predictiveService.Data.subscribe((idx: number) => {
      if (idx >= 0) {
        this.toggleDronePause(idx, true);
      }
    })

  }

  public pauseDemo(): void {
    this.feedsService.pauseFeeds();
    this.isDemoLive = false;
    this.toggleDrones('false');
    this.toastService.info('The demo has successfully paused', 'Demo Paused!');
    this.btnTxt = toggleDemoBtnTxt[2];
    this.logs.push('DemoPause: ' + this.getTimestamp());
  }

  public togglePredictive(): void {
    if (!this.isDemoLive) {
      this.isDemoLive = false;
      this.isDemoStarted = false;
      this.restartDrones();
      this.btnTxt = toggleDemoBtnTxt[0];
      this.logs.push('DemoRestart: ' + this.getTimestamp());

      this.feedsService.isPredictive = !this.feedsService.isPredictive;
      this.feedsService.getFeeds();

      if(this.feedsService.isPredictive)
        this.toastService.success('The demo has successfully switched to predictive mode');
      else
        this.toastService.success('The demo has successfully switched to non predictive mode');
    }
  }

  public toggleDronePause(idx: number, pause: boolean): void {
    this.putDronePause(this.droneService.droneList[idx].uuid, pause).pipe(take(1)).subscribe();
  }
}

enum toggleDemoBtnTxt {
  'Start Demo',
  'Pause Demo',
  'Continue Demo',
}
