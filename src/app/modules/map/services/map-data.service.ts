import { Injectable } from '@angular/core';
import VectorSource from 'ol/source/Vector';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  public placeName: any;
  public toLocation: any;
  public pointVertorSource: any = VectorSource;
  public olmap: any;
  public geoJSONData = [
    {
      type: 'Feature',
      name: 'Hydrabad',
      geometry: {
        type: 'Point',
        coordinates: [78, 17],
      },
    },
    {
      type: 'Feature',
      name: 'Bengalore',
      geometry: {
        type: 'Point',
        coordinates: [78, 13],
      },
    },
    {
      type: 'Feature',
      name: 'Delhi',
      geometry: {
        type: 'Point',
        coordinates: [77, 29],
      },
    },
    {
      type: 'Feature',
      name: 'Patna',
      geometry: {
        type: 'Point',
        coordinates: [85, 26],
      },
    },
    {
      type: 'Feature',
      name: 'Raipur',
      geometry: {
        type: 'Point',
        coordinates: [82, 21],
      },
    },
  ];

  constructor(private http: HttpClient) {}

  getFiberData(core) {
    return this.http.get(`assets/Delhi_Data_Set/core${core}.json`);
  }
}
