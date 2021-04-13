import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { DemoService } from './demo.service';
import { FeedsService } from './feeds.service';

@Injectable({
  providedIn: 'root'
})
export class PredictiveService {
  private TriggerSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private DataSub: BehaviorSubject<number> = new BehaviorSubject<number>(NaN);
  public ShowInfoCardSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private IntrusiveSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public ShowPredictive: Observable<boolean> = this.TriggerSub.asObservable();
  public Data: Observable<number> = this.DataSub.asObservable();
  public ShowInfoCard: Observable<boolean> = this.ShowInfoCardSub.asObservable();
  public Intrusive: Observable<boolean> = this.IntrusiveSub.asObservable();

  private block: boolean = false;

  public TIMESTAMP: number = 59.35

  constructor(private feedService: FeedsService, private toastrService: ToastrService, private demoService: DemoService) {

  }

  public enablePredictive(data: string = '') {
    if(!this.feedService.isPredictive) {
      return;
    }

    if (!this.block) {
      this.block = true;
      setTimeout(() => { this.block = false; }, 1000);
      this.DataSub.next(this.feedService.feedsActiveSub.value.indexOf(data));
      this.feedService.setPredictiveSource(this.feedService.feedsActiveSub.value.indexOf(data));
      this.TriggerSub.next(true);
      this.ShowInfoCardSub.next(true);
    }
  }

  public removePredictive() {
    this.TriggerSub.next(false);
    this.ShowInfoCardSub.next(false);
    this.DataSub.next(NaN);
  }

  public confirmPrediction() {
    this.ShowInfoCardSub.next(false);
  }

  public toggleIntrusive(): void {
    if (this.demoService.isDemoLive) {
      this.toastrService.warning('Demo must be paused to switch intrusive mode!');
      return;
    }
    
    this.IntrusiveSub.next(!this.IntrusiveSub.value);
    if (this.IntrusiveSub.value === true)
      this.toastrService.success('Intrusive mode is now active!');
    else
      this.toastrService.success('Non intrusive mode is now active!');
  }
}
