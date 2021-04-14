import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Boat } from '../models/boat.model';
import { Position } from '../models/position.model';
import { ApiBaseService } from './api-base.service';
import { DemoService } from './demo.service';
import { MapService } from './map.service';
import { SignalRService } from './signal-r.service';
import { TickService } from './tick.service';

@Injectable({
  providedIn: 'root'
})
export class BoatService extends ApiBaseService<Boat, string> {
  private ms: number = 10;

  private boatPositionSub: BehaviorSubject<Position> = new BehaviorSubject<Position>(null);
  public BoatPosition: Observable<Position> = this.boatPositionSub.asObservable();

  private boatOrientationSub: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public BoatOrientation: Observable<number> = this.boatOrientationSub.asObservable();

  private movementSub: Subscription;

  private destination: Position;

  constructor(
    private mapService: MapService,
    private tickService: TickService,
    private demoService: DemoService,
    private signalR: SignalRService,
    http: HttpClient,
    toast: ToastrService)
  {
    super(`${environment.api.baseUrl}/boats`, http, toast);
    this.tickService.UpdateClock.subscribe(() => this.getPosition());

    signalR.addDemoStateListener((paused) => {
      if (paused) {
        this.movementSub?.unsubscribe();
      } else
        this.MoveTo(this.destination.lat, this.destination.lng);
    });
  }

  private getPosition(): void {
    this.get('1').subscribe({
      next: (boat: Boat) => {
        this.boatPositionSub.next({lat: boat.currentPosition.latitude, lng: boat.currentPosition.longitude});
        this.boatOrientationSub.next(boat.currentPosition.bearing - 90);
      }
    });
  }

  public MoveTo(lat: number, lng: number): void {
    if (!this.demoService.isDemoLive) return;
    this.movementSub?.unsubscribe();
    this.destination = {lat, lng};

    let position = this.boatPositionSub.value;
    const distance = this.mapService.calculateDistance(position.lat, position.lng, lat, lng);
    const steps = distance / this.ms;

    this.movementSub = this.tickService.UpdateClock.pipe(take(steps)).subscribe(() => {
      position = this.boatPositionSub.value;
      const bearing = this.mapService.calculateBearing(position.lat, position.lng, lat, lng);
      const newPosition = this.mapService.getCoordinate(position.lat, position.lng, bearing, this.ms);


      this.put('1', {id: 1, currentPosition: {
        latitude: newPosition.lat,
        longitude: newPosition.lng,
        altitude: 0,
        bearing,
      }}).pipe(take(1)).subscribe()
    });
  }

}
