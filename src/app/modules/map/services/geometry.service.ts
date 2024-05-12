import { Injectable } from '@angular/core';

import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { FullScreen, MousePosition, ScaleLine, defaults } from 'ol/control';
import { format, toStringHDMS } from 'ol/coordinate';
import Feature from 'ol/Feature.js';
import { LineString, Polygon } from 'ol/geom';
import Graticule from 'ol/layer/Graticule';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import Point from 'ol/geom/Point';
import Tile from 'ol/layer/Tile.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import View from 'ol/View.js';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import proj4 from 'proj4';
import * as turf from '@turf/turf';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeometryService {
  public drawPointInteraction: any;
  public geometryID: any;
  public singleClickKey: any;
  public $bindPointData: Subject<any> = new Subject();
  public generalMeasurementUnit: any = { id: 'km', unit: 'km' };
  public measurementUnits: Array<any>;
  public pointVertorSource: any = VectorSource;
  public geoJSONPointVertorSource: any;
  public pointData: any;
  public isDrawRoutes: boolean = false;
  public map: any;
  public isEdit: boolean = false;
  public seletectedMenuItem: any;
  public $refreshMapData: Subject<any> = new Subject();
  public routeVertorSource: any = new VectorSource();
  public routeData: any;
  public isDrawRoute: boolean = false;
  public drawRouteInteraction: any;
  public routeCoordinates: any = [];
  public $bindRouteData: Subject<any> = new Subject();
  public geoJSONRoute: any;
  public isDrawPolygon: boolean = false;
  public polygonVertorSource: any;
  public drawPolygonInteraction: any;
  public polygonCoordinates: any = [];
  public $bindPolygonData: Subject<any> = new Subject();
  public geoJSONPolygon: any;
  public polygonData: any;
  public sectorVertorSource: any;
  public drawSectorInteraction: any;
  public $bindSectorData: Subject<any> = new Subject();
  public geoJSONLettered: any;
  public sectorData: any;
  public letteredData: any;
  public elevationVectorSource: VectorSource = new VectorSource();
  public polyExtent: any;

  public chandaniChaukAVectorSource: any;
  public chandaniChaukBVectorSource: any;
  public delhiCantVectorSource: any;
  public jangpuraVectorSource: any;
  public karolbaghVectorSource: any;
  public newDelhiVectorSource: any;
  public rajendraNagarAVectorSource: any;
  public rajendraNagarBVectorSource: any;
  public bijwasanAVectorSource: any;
  public bijwasanBVectorSource: any;
  public bijwasanCVectorSource: any;

  public blueDistributionVectorSource: any;
  public redDistributionVectorSource: any;
  public yellowDistributionVectorSource: any;

  constructor() {}

  public addLayerSepratly(className: any, source: any): any {
    let mapLayer = new VectorLayer({
      className: className,
      source: source,
    });
    mapLayer.set('title', className);
    mapLayer.set('visible', true);
    this.map.addLayer(mapLayer);
  }

  private getPoint(lat: any, lon: any, r: any, deg: any): any {
    let lat2 = Math.sin(this.deg2rad(deg)) * r + lat;
    let lon2 = Math.cos(this.deg2rad(deg)) * r + lon;
    console.log('sssssss', lat, lon, r, deg, lat2, lon2);
    return [lat2, lon2];
  }

  private deg2rad(deg: any): any {
    return deg * (Math.PI / 180);
  }

  private converMeasurementIntoCoordinate(
    measurementType: any,
    measurementValue: any
  ): any {
    let convertedValue: any;
    if (measurementType === 'km') {
      convertedValue = measurementValue / 111.12;
    } else if (measurementType === 'nm') {
      convertedValue = measurementValue / 60;
    }
    return convertedValue;
  }

  private convertToRGBA(color: any, opacity: any): any {
    return `rgba(${color.r},${color.g},${color.b}, ${opacity})`;
  }

  public addPointFeature(coordinates: any, name: any): void {
    let point = new Point(coordinates);
    let pointFeature = new Feature(point);
    let styles = [
      new Style({
        image: new Icon({
          src: 'assets/images/Location.svg',
          scale: [0.6, 0.6],
          color: 'yellow',
        }),
        text: new Text({
          text: name,
          textAlign: 'start',
          scale: [0.75, 0.75],
          offsetX: 3,
          font: 'bold 12px Arial, Verdana, Helvetica, sans-serif',
          fill: new Fill({
            color: '#0b3c5c',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 1,
          }),
        }),
      }),
    ];
    pointFeature.setStyle(styles);
    pointFeature.setProperties({ type: 'Point' });
    this.pointVertorSource.addFeature(pointFeature);
  }

  public addPointFeatureDistribution(pointData: any, vectorSource: any): void {
    let point = new Point(pointData.geometry.coordinates);
    let pointFeature = new Feature(point);
    let styles = [
      new Style({
        image: new Icon({
          src: pointData?.icon,
          scale: [0.035, 0.035],
          // color: pointData?.color,
          // rotation: pointData?.rotation,
        }),
        text: new Text({
          text: pointData?.properties?.name,
          textAlign: 'start',
          scale: [0.75, 0.75],
          offsetX: -2,
          offsetY:-12,
          font: 'bold 12px Arial, Verdana, Helvetica, sans-serif',
          fill: new Fill({
            color: '#000000',
          }),
          // stroke: new Stroke({
          //   color: '#fffff',
          //   // width: 2,
          // }),
        }),
      }),
    ];
    pointFeature.setStyle(styles);
    pointFeature.setProperties({
      type: 'FIiber-Distribution-Box',
      junctionData: pointData,
    });
    vectorSource.addFeature(pointFeature);
  }

  public addPointFeatureGeoJSON(coordinates: any, name: any): void {
    let point = new Point(coordinates);
    let pointFeature = new Feature(point);
    let styles = [
      new Style({
        image: new Icon({
          src: 'assets/images/Location.svg',
          scale: [0.6, 0.6],
          color: 'yellow',
        }),
        text: new Text({
          text: name,
          textAlign: 'start',
          scale: [0.75, 0.75],
          offsetX: 3,
          font: 'bold 12px Arial, Verdana, Helvetica, sans-serif',
          fill: new Fill({
            color: '#000000',
          }),
          // stroke: new Stroke({
          //   color: '#fff',
          //   width: 1,
          // }),
        }),
      }),
    ];
    pointFeature.setStyle(styles);
    pointFeature.setProperties({ type: 'GeoJSON-Point' });
    this.geoJSONPointVertorSource.addFeature(pointFeature);
  }

  public addLosPointFeature(coordinates: any, pointData: any): void {
    let point = new Point(coordinates);
    let pointFeature = new Feature(point);
    let styles = [
      new Style({
        image: new Icon({
          src: 'assets/images/location-poi-svgrepo-com.svg',
          scale: [0.035, 0.035],
          // anchor: [0.55, 0.55],
        }),
        text: new Text({
          text: 'LOS',
          textAlign: 'start',
          scale: [1, 1],
          offsetX: 3,
          font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
          fill: new Fill({
            color: '#0b3c5c',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 1,
          }),
        }),
      }),
    ];
    pointFeature.setStyle(styles);
    pointFeature.setProperties({ type: 'Point' });
    //pointFeature.setId('10');
    this.pointVertorSource.addFeature(pointFeature);
  }

  public addRouteFeature(routeData: any, vectorSource: any): void {
    let point = new LineString(routeData.features[0].geometry.coordinates[0]);
    let routeFeature = new Feature(point);
    let styles = [
      new Style({
        stroke: new Stroke({
          color: routeData.features[0].color,
          width: 2.5,
          // lineDash: [6, 6],
        }),
        text: new Text({
          text: routeData.features[0].properties.ac_name,
          textAlign: 'start',
          scale: [1, 1],
          // offsetX: 30,
          // offsetY:-26,
          font: 'bold 11px Arial, Verdana, Helvetica, sans-serif',
          fill: new Fill({
            color: '#000000',
          }),
        }),
      }),
    ];
    routeFeature.setStyle(styles);
    routeFeature.setProperties({
      type: 'Optical-Fiber-Network',
      core: routeData.features[0].core,
      routeData: routeData,
    });
    // routeFeature.setId(routeData.id);
    vectorSource.addFeature(routeFeature);
  }

  public findBearing(coordsArray: any): any {
    var point1 = turf.point([coordsArray[0][0], coordsArray[0][1]]);
    var point2 = turf.point([coordsArray[1][0], coordsArray[1][1]]);
    return turf.bearing(point1, point2).toPrecision(5);
  }

  public findLengthBetweenTwoPoint(coordsArray: any): any {
    var point1 = turf.point([coordsArray[0][0], coordsArray[0][1]]);
    var point2 = turf.point([coordsArray[1][0], coordsArray[1][1]]);
    return turf.distance(point1, point2, { units: 'kilometers' });
  }

  public findLengthOfLinestring(coordsArray: any): any {
    var line = turf.lineString(coordsArray);
    return turf.length(line, { units: 'kilometers' });
  }

  public findCenterOfLinestring(coordsArray: any): any {
    var features = turf.points([coordsArray[0]]);
    var center = turf.center(features);
    return center.geometry.coordinates;
  }

  public calculateAreaOfPolygon(coordsArray: any): any {
    var polygonCoords = turf.polygon([coordsArray[0]]);
    var area = turf.area(polygonCoords);
    return area / 1000000;
  }

  public calculateCenterOfPolygon(coordsArray: any): any {
    var polygonCoords = turf.polygon([coordsArray[0]]);
    var centroid = turf.centroid(polygonCoords);
    return centroid.geometry.coordinates;
  }

  public findDestinationPoint(pointCoord: any, formData: any): any {
    var point = turf.point(pointCoord);
    var distance = formData.distance;
    var bearing = formData.bearing;
    var destination = turf.destination(point, distance, bearing, {
      units: 'kilometers',
    });
    return destination.geometry.coordinates;
  }
}
