import { Component, HostListener, OnInit } from '@angular/core';
import { BoatService } from 'src/app/services/boat.service';
import { DemoService } from 'src/app/services/demo.service';
import { DroneService } from 'src/app/services/drone.service';
import { FeedsService } from 'src/app/services/feeds.service';
import { MapService } from 'src/app/services/map.service';
import { PersonService } from 'src/app/services/person.service';
import { PredictiveService } from 'src/app/services/predictive.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import mapstyle from '../../../assets/mapstyle.json';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public mapstyle = mapstyle;

  private coneLength = 60;
  private coneAngle = 90;


  constructor(
    public droneService: DroneService,
    public mapService: MapService,
    public boatService: BoatService,
    public feedsService: FeedsService,
    public personService: PersonService,
    public demoService: DemoService,
    public predictiveService: PredictiveService,
    private signalR: SignalRService
  ) { }

  ngOnInit(): void {
  }

  public ctrlClick(event): void {
    if (event.domEvent.ctrlKey) {
      this.click(event);
    }
  }

  public click(event: google.maps.PolyMouseEvent): void {
    const lat: number = event.latLng.lat();
    const lng: number = event.latLng.lng();

    this.boatService.MoveTo(lat, lng);
    this.demoService.addMapClickToLog(lat, lng);
  }

  private degToRad(degress: number): number {
    return degress * (Math.PI / 180);
  }

  private getX(angle: number): number {
    return this.coneLength * Math.cos(this.degToRad(angle));
  }

  private getY(angle: number): number {
    return this.coneLength * Math.sin(this.degToRad(angle));
  }

  public getSvgPath(angle: number): string {
    const diff = this.coneAngle/ 2;

    const x1 = Math.round(this.getX(angle - diff))
    const y1 = Math.round(this.getY(angle - diff))

    const x2 = Math.round(this.getX(angle + diff))
    const y2 = Math.round(this.getY(angle + diff))

    return 'M0,-15 ' + x1 + ',' + (y1 - 15) + ' ' + x2 + ',' + (y2 - 15) + 'z';
  }
}
