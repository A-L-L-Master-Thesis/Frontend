import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { FeedsService } from 'src/app/services/feeds.service';
import { PredictiveService } from 'src/app/services/predictive.service';

@Component({
  selector: 'app-object-confirm',
  templateUrl: './object-confirm.component.html',
  styleUrls: ['./object-confirm.component.scss'],
})
export class ObjectConfirmComponent implements OnInit {
  constructor(
    public feedService: FeedsService,
    public predictiveService: PredictiveService
  ) {}

  ngOnInit(): void {}

  public confirm() {
    this.predictiveService.confirmPrediction();
  }

  public ignore() {
    this.predictiveService.removePredictive();
  }

  public view() {
    this.predictiveService.Data.pipe(take(1)).subscribe((index: number) => {
      this.feedService.activeFullscreenTime = this.feedService.playerApiList[
        index
      ].currentTime;
      this.feedService.activeFullscreenSourceSub.next(
        this.feedService.feeds[index]
      );
    });
  }
}