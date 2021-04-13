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
import { LogsService } from './logs.service';
import { Observable } from 'rxjs';
import { DroneStatus } from '../models/drone-status.enum';

@Injectable({
  providedIn: 'root',
})
export class DemoService extends ApiBaseService<string, string> {
  constructor(
    protected toastService: ToastrService,
    protected feedsService: FeedsService,
    protected httpClient: HttpClient,
    protected predictiveService: PredictiveService,
    protected droneService: DroneService,
    private logService: LogsService
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

  public restartDemo(): void {
    if (this.isDemoLive) {
      this.toastService.error('You must pause the demo before resetting', 'Reset Failed');
      return;
    }

    this.restartDrones();
    this.btnTxt = toggleDemoBtnTxt[0];
    this.predictiveService.ShowInfoCardSub.next(false); 
    this.logs.push('DemoRestart: ' + this.getTimestamp());
    this.logService.sendLog('DemoRestart: ' + this.getTimestamp());
    this.feedsService.getFeeds();
    this.toastService.success('The demo has successfully resetted', 'Reset Succeeded');
  }

  public addMapClickToLog(lat: number, lng: number) {
    const msg = 'MapClick: ' + this.getTimestamp() + ' | ' + lat + ', ' + lng;
    this.logs.push(msg);
    this.logService.sendLog(msg);
  }

  public getTimestamp() {
    const now: Date = new Date();
    return (
      now.getHours() +
      ':' +
      now.getMinutes() +
      ':' +
      now.getSeconds() +
      ':' +
      now.getMilliseconds()
    );
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
    this.logService.sendLog('DemoStart: ' + this.getTimestamp());

    this.predictiveService.Data.subscribe((idx: number) => {
      if (idx >= 0) {
        this.toggleDronePause(idx, true);
      }
    });
  }

  public pauseDemo(): void {
    this.feedsService.pauseFeeds();
    this.isDemoLive = false;
    this.toggleDrones('false');
    this.toastService.info('The demo has successfully paused', 'Demo Paused!');
    this.btnTxt = toggleDemoBtnTxt[2];
    this.logs.push('DemoPause: ' + this.getTimestamp());
    this.logService.sendLog('DemoPause: ' + this.getTimestamp());
  }

  public togglePredictive(): void {
    if (!this.isDemoLive) {
      this.logs.push('Predictive Toggle: ' + this.getTimestamp());
      this.logService.sendLog('Predictive Toggle: ' + this.getTimestamp());
      this.feedsService.isPredictive = !this.feedsService.isPredictive;
      this.restartDemo();

      if (this.feedsService.isPredictive)
        this.toastService.success(
          'The demo has successfully switched to predictive mode', 'Switch Succeeded');
      else
        this.toastService.success(
          'The demo has successfully switched to non predictive mode', 'Switch Succeeded');
    }
  }

  public toggleDronePause(idx: number, pause: boolean): void {
    this.putDronePause(this.droneService.droneList[idx].uuid, pause)
      .pipe(take(1))
      .subscribe();
  }

  public toggleSelectedDroneMovement(): void {
    let idx: number = this.feedsService.feedsActiveSub.value.indexOf(this.feedsService.enlargedVidPathSub.value.split('?')[0]);
    let isPaused: boolean = this.droneService.droneList[idx].status != DroneStatus.Searching;

    this.toggleDronePause(idx, !isPaused);
  }
}

enum toggleDemoBtnTxt {
  'Start Demo',
  'Pause Demo',
  'Continue Demo',
}
