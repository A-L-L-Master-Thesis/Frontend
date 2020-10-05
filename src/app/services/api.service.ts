import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DroneDto } from '../models/drone.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  public getDrones(): Observable<DroneDto[]> {
    return this.httpClient.get<DroneDto[]>('https://localhost:44310/api/drones');
  }
}
