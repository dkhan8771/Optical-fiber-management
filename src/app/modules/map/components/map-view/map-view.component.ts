import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import { FullScreen, MousePosition, ScaleLine, defaults } from 'ol/control';
import { format, toStringHDMS } from 'ol/coordinate';
import { HttpClient } from '@angular/common/http';

import Feature from 'ol/Feature.js';
import Graticule from 'ol/layer/Graticule';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import Map from 'ol/Map.js';
import { MapDataService } from '../../services/map-data.service';
import OSM from 'ol/source/OSM.js';
import Point from 'ol/geom/Point';
import Tile from 'ol/layer/Tile.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { TileWMS, Vector as VectorSource } from 'ol/source.js';
import View from 'ol/View.js';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import proj4 from 'proj4';
import TileLayer from 'ol/layer/Tile.js';
import { GeometryService } from '../../services/geometry.service';
import LayerGroup from 'ol/layer/Group';
import { MessageService } from 'primeng/api';
import { CoreService } from 'src/app/core/services/core.service';
import { Router } from '@angular/router';
import ContextMenu from 'ol-contextmenu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import CircleStyle from 'ol/style/Circle';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay';
import GeoJSON from 'ol/format/GeoJSON';
import { getCenter } from 'ol/extent';
import { TitleCasePipe } from '@angular/common';
import { TableComponent } from 'src/app/table/table.component';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
  providers: [TitleCasePipe],
})
export class MapViewComponent implements OnInit {
  public map: any;
  public delhiMap: Tile<TileWMS>;

  public chandaniChaukAURL = 'assets/Delhi_Data_Set/chandaniChaukA.geojson';
  public chandaniChaukBURL = 'assets/Delhi_Data_Set/chandaniChaukB.geojson';
  public delhiCantURL = 'assets/Delhi_Data_Set/delhiCantt.geojson';
  public jangpuraURL = 'assets/Delhi_Data_Set/jangpura.geojson';
  public karolbaghURL = 'assets/Delhi_Data_Set/karolBagh.geojson';
  public newDelhiURL = 'assets/Delhi_Data_Set/newDelhi.geojson';
  public rajendraNagarAURL = 'assets/Delhi_Data_Set/rajinderNagarA.geojson';
  public rajendraNagarBURL = 'assets/Delhi_Data_Set/rajinderNagarB.geojson';
  public bijwasanAURL = 'assets/Delhi_Data_Set/bijwasanA.geojson';
  public bijwasanBURL = 'assets/Delhi_Data_Set/bijwasanB.geojson';
  public bijwasanCURL = 'assets/Delhi_Data_Set/bijwasanC.geojson';

  public chandaniChaukAData: any;
  public chandaniChaukBData: any;
  public delhiCantData: any;
  public jangpuraData: any;
  public karolbaghData: any;
  public newDelhiData: any;
  public rajendraNagarAData: any;
  public rajendraNagarBData: any;
  public bijwasanAData: any;
  public bijwasanBData: any;
  public bijwasanCData: any;

  public blueDistributionURL = 'assets/Delhi_Data_Set/blueDistribution.geojson';
  public redDistributionURL = 'assets/Delhi_Data_Set/redDistribution.geojson';
  public yellowDistributionURL =
    'assets/Delhi_Data_Set/yellowDistribution.geojson';

  public blueDistributionData: any;
  public redDistributionData: any;
  public yellowDistributionData: any;

  /** global variable for context-menu */
  public defaultMenu: any = [
    {
      text: 'Zoom Home',
      icon: 'assets/images/zoom-home.svg',
      callback: this.setDefaultView.bind(this),
    },
  ];
  public menu: any = [];
  public container = document.getElementById('popup');
  public content = document.getElementById('popup-content');
  public closer = document.getElementById('popup-closer');
  public overlay: Overlay;
  public popup: Overlay;
  public contextMenuPosition: any = [];
  public popupContainerElement: any;
  public popupData: string;
  public fiberNetworkMenu: any = [
    {
      text: 'Get Feature Info',
      icon: 'assets/images/featureInfo.svg',
      callback: this.getFeatureInfo.bind(this),
    },
    {
      text: 'Optical Fiber Details',
      icon: 'assets/images/featureInfo.svg',
      callback: this.openDetails.bind(this),
    },
  ];
  public fiberJunctionMenu: any = [
    {
      text: 'Get Feature Info',
      icon: 'assets/images/featureInfo.svg',
      callback: this.getFeatureInfo.bind(this),
    },
  ];

  /** global variable for Geo-coding */
  public selectedLocation: any;
  public filteredLocations: any[] = [];
  public iconSource: VectorSource | undefined;
  public vectorSource: VectorSource = new VectorSource();
  public coreValue: any;
  public ref: any;
  public placeName: any = '';

  constructor(
    private mapService: MapDataService,
    private geometryService: GeometryService,
    private http: HttpClient,
    private router: Router,
    public coreService: CoreService,
    private upper: TitleCasePipe,
    public messageService: MessageService,
    public dialogService: DialogService
  ) {
    this.loadVectorLayers();
    this.initializeMapLayer();
    this.geometryService.pointVertorSource = new VectorSource();
    this.geometryService.routeVertorSource = new VectorSource();
    this.geometryService.polygonVertorSource = new VectorSource();
    this.geometryService.geoJSONPointVertorSource = new VectorSource();
    this.geometryService.chandaniChaukAVectorSource = new VectorSource();
    this.geometryService.chandaniChaukBVectorSource = new VectorSource();
    this.geometryService.delhiCantVectorSource = new VectorSource();
    this.geometryService.jangpuraVectorSource = new VectorSource();
    this.geometryService.karolbaghVectorSource = new VectorSource();
    this.geometryService.newDelhiVectorSource = new VectorSource();
    this.geometryService.rajendraNagarAVectorSource = new VectorSource();
    this.geometryService.rajendraNagarBVectorSource = new VectorSource();
    this.geometryService.bijwasanAVectorSource = new VectorSource();
    this.geometryService.bijwasanBVectorSource = new VectorSource();
    this.geometryService.bijwasanCVectorSource = new VectorSource();
    this.geometryService.blueDistributionVectorSource = new VectorSource();
    this.geometryService.redDistributionVectorSource = new VectorSource();
    this.geometryService.yellowDistributionVectorSource = new VectorSource();
  }

  ngOnInit(): void {
    this.loadVectorLayers();
    this.addGeoJSON();
    this.contextMenu();
    this.getAllOpticalData();

    this.geometryService.map.on('click', (evt: any) => {
      this.popup?.setPosition(undefined);
    });
  }

  ngAfterViewInit(): void {
    this.geometryService.map.setTarget('map');
    this.addMapControl();
  }

  public contextMenu(): any {
    var contextmenu = new ContextMenu({
      width: 160,
      defaultItems: true,
      items: this.defaultMenu,
    });
    this.geometryService.map.addControl(contextmenu);

    let restore = false;
    contextmenu.on('open', (evt) => {
      /** setting-up the position for the context menu */
      const feature = this.geometryService.map.forEachFeatureAtPixel(
        evt.pixel,
        (ft: any) => {
          return ft;
        }
      );
      this.contextMenuPosition = evt.target.coordinate;
      console.log('feature', feature);
      /** adding popup for different features */
      if (feature && feature.values_.type == 'Optical-Fiber-Network') {
        console.log('feature111', feature);
        contextmenu.clear();
        this.fiberNetworkMenu.forEach((geoJSONMenuItem: any) => {
          contextmenu.push(geoJSONMenuItem);
        });
        contextmenu.extend(contextmenu.getDefaultItems());
        this.defaultMenu.forEach((menuItem: any) => {
          contextmenu.push(menuItem);
        });
        restore = true;
        this.coreValue = feature.values_.core;
        this.mapService.placeName =
          feature.values_.routeData.features[0].properties.ac_name ?? '';
        this.mapService.toLocation =
          feature.values_.routeData.features[0].properties.to ?? '';
        this.popupData =
          '<p>' +
          '<b> Optical Fiber Network Details: </b>' +
          '<br> Network Type &nbsp; &nbsp; &nbsp; : ' +
          feature.values_.type +
          '<br>No of Core &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;: ' +
          feature.values_.routeData.features[0]?.core +
          '<br>Core Type &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; : ' +
          feature.values_.routeData.features[0]?.coreType +
          '<br> Network Area &nbsp; &nbsp; &nbsp; &nbsp;: ' +
          feature.values_.routeData.features[0].properties.ac_name +
          '<br> Coverage Length &nbsp;: ' +
          feature.values_.routeData.features[0].properties.Shape__Length.toFixed(
            3
          ) +
          ' m' +
          '<br> Coverage Area &nbsp; &nbsp; &nbsp;: ' +
          feature.values_.routeData.features[0].properties.Shape__Area.toFixed(
            3
          ) +
          ' m&sup2;' +
          '</p>';
      } else if (feature && feature.values_.type == 'FIiber-Distribution-Box') {
        console.log('feature111', feature);
        contextmenu.clear();
        this.fiberJunctionMenu.forEach((fiberJunctionMenuItem: any) => {
          contextmenu.push(fiberJunctionMenuItem);
        });
        contextmenu.extend(contextmenu.getDefaultItems());
        this.defaultMenu.forEach((menuItem: any) => {
          contextmenu.push(menuItem);
        });
        restore = true;
        this.popupData =
          '<p>' +
          '<b> FIiber Distribution Box Details: </b>' +
          '<br> Junction Type &nbsp; &nbsp;: ' +
          feature.values_.type +
          '<br> Junction Name &nbsp;: ' +
          feature.values_.junctionData.properties.name +
          '<br> Network Type &nbsp; &nbsp;: ' +
          feature.values_.junctionData.networkDistribition +
          '<br> Junction Lon &nbsp; &nbsp; &nbsp;: ' +
          feature.values_.geometry.flatCoordinates[0] +
          '<br> Junction Lat &nbsp; &nbsp; &nbsp; : ' +
          feature.values_.geometry.flatCoordinates[1] +
          '</p>';
      } else {
        contextmenu.clear();
        contextmenu.extend(contextmenu.getDefaultItems());
        this.defaultMenu.forEach((menuItem: any) => {
          contextmenu.push(menuItem);
        });
        restore = false;
      }
    });
  }

  public getFeatureInfo(): void {
    this.popupContainerElement = document.getElementById('popup-coordinates');
    const closer = document.getElementById('popup-closer');
    this.popup = new Overlay({
      element: this.popupContainerElement,
      positioning: 'top-left',
      autoPan: {
        animation: {
          duration: 250,
        },
      },
      stopEvent: false,
      offset: [30, -110],
    });
    this.geometryService.map.addOverlay(this.popup);
    this.popup.setPosition(this.contextMenuPosition);
    this.popupContainerElement.innerHTML = this.popupData;
    // setTimeout(() => {
    //   this.popup.setPosition(undefined);
    // }, 10000);
  }

  public openDetails(feature: any): void {
    this.ref?.close();
    this.ref = this.dialogService.open(TableComponent, {
      header: this.mapService.placeName + ' Optical Fibre Segment Details',
      height: 'fit-content',
      width: '80vw',
      data: this.coreValue,
      modal: false,
      keepInViewport: true,
      position: 'top-left',
      minX: 1,
      minY: 1,
      draggable: true,
      style: {
        top: '25vh',
        left: '19vw',
      },
    });
  }

  public initializeMapLayer(): void {
    this.geometryService.map = new Map({
      controls: defaults({ attribution: false }),
      view: new View({
        projection: 'EPSG:4326',
        center: [77.14, 23.607],
        zoom: 4.5,
        // center: [77.14, 28.607],
        // zoom: 12,
      }),
    });

    this.delhiMap = new TileLayer({
      source: new TileWMS({
        url: 'http://localhost:8080/geoserver/ne/wms',
        params: { LAYERS: 'ne:Delhi_map', TILED: true },
        serverType: 'geoserver',
      }),
      opacity: 1,
      // minZoom: 5
    });
    this.delhiMap.set('title', 'Delhi Map');
    this.delhiMap.set('visible', true);

    var worldMap = new TileLayer({
      source: new TileWMS({
        url: 'http://172.22.22.24:8080/geoserver/ne/wms',
        params: { LAYERS: 'ne:HYP_HR_SR_OB_DR', TILED: true },
        serverType: 'geoserver',
      }),
      opacity: 1,
      // minZoom: 5
    });
    worldMap.set('title', 'World Raster');
    worldMap.set('visible', true);

    var indiaMap = new TileLayer({
      source: new TileWMS({
        url: 'http://172.22.22.24:8080/geoserver/ne/wms',
        params: { LAYERS: 'ne:India_Country_Boundary', TILED: true },
        serverType: 'geoserver',
      }),
      opacity: 1,
      // minZoom: 5
    });
    indiaMap.set('title', 'World Raster');
    indiaMap.set('visible', true);

    var worldCountries = new TileLayer({
      source: new TileWMS({
        url: 'http://172.22.22.24:8080/geoserver/ne/wms',
        params: { LAYERS: '	ne:countries', TILED: true },
        serverType: 'geoserver',
      }),
      opacity: 0.5,
      // minZoom: 5
    });
    worldCountries.set('title', 'World Countries');
    worldCountries.set('visible', true);

    var worldPlaces = new TileLayer({
      source: new TileWMS({
        url: 'http://172.22.22.24:8080/geoserver/ne/wms',
        params: { LAYERS: 'ne:populated_places', TILED: true },
        serverType: 'geoserver',
      }),
      opacity: 1,
      // minZoom: 5
    });
    worldPlaces.set('title', 'World Places');
    worldPlaces.set('visible', true);

    var osm = new Tile({
      source: new OSM({
        url: 'assets/osm/{z}/{y}/{x}.png',
      }),
    });
    osm.set('title', 'OSM');
    osm.set('visible', false);

    let worldLayerGroup = new LayerGroup({
      layers: [osm, worldMap, worldCountries,indiaMap, worldPlaces],
    });
    worldLayerGroup.set('title', 'World Group');
    worldLayerGroup.set('fold', true);
    this.geometryService.map.addLayer(worldLayerGroup);

    var graticule_layer = new Graticule({
      strokeStyle: new Stroke({
        color: 'rgba(1, 0.5, 0.6, 0.9)',
        width: 1.5,
        lineDash: [0.5, 4],
      }),
      showLabels: true,
      intervals: [6, 4],
      targetSize: 100,
      wrapX: true,
      visible: false,
    });
    graticule_layer.set('title', 'Grid');
    graticule_layer.set('visible', true);
    this.geometryService.map.addLayer(graticule_layer);
  }

  private async loadVectorLayers(): Promise<void> {
    let geoJson = this.addGeometryLayer(
      'GeoJSON',
      this.geometryService.pointVertorSource
    );
    /** Distribution Network */
    let chandaniChaukAVectorLayer = this.addGeometryLayer(
      'CC Sec-B',
      this.geometryService.chandaniChaukAVectorSource
    );
    let chandaniChaukBVectorLayer = this.addGeometryLayer(
      'CC Sec-B',
      this.geometryService.chandaniChaukBVectorSource
    );
    let delhiCantVectorLayer = this.addGeometryLayer(
      'Delhi Cant',
      this.geometryService.delhiCantVectorSource
    );
    let jangpuraVectorLayer = this.addGeometryLayer(
      'Jaganpura',
      this.geometryService.jangpuraVectorSource
    );
    let karolbaghVectorLayer = this.addGeometryLayer(
      'Karol Bagh',
      this.geometryService.karolbaghVectorSource
    );
    let newDelhiVectorLayer = this.addGeometryLayer(
      'New Delhi',
      this.geometryService.newDelhiVectorSource
    );
    let rajendraNagarAVectorLayer = this.addGeometryLayer(
      'RN Sec-A',
      this.geometryService.rajendraNagarAVectorSource
    );
    let rajendraNagarBVectorLayer = this.addGeometryLayer(
      'RN Sec-A',
      this.geometryService.rajendraNagarBVectorSource
    );
    let bijwasanAVectorLayer = this.addGeometryLayer(
      'Bijwasan-A',
      this.geometryService.bijwasanAVectorSource
    );
    let bijwasanBVectorLayer = this.addGeometryLayer(
      'Bijwasan-B',
      this.geometryService.bijwasanBVectorSource
    );
    let bijwasanCVectorLayer = this.addGeometryLayer(
      'Bijwasan-C',
      this.geometryService.bijwasanCVectorSource
    );

    let blueGroup = new LayerGroup({
      layers: [
        bijwasanCVectorLayer,
        bijwasanBVectorLayer,
        bijwasanAVectorLayer,
        delhiCantVectorLayer,
      ],
    });
    blueGroup.set('title', 'Blue OFM');
    blueGroup.set('fold', true);

    let yellowGroup = new LayerGroup({
      layers: [
        geoJson,
        chandaniChaukBVectorLayer,
        chandaniChaukAVectorLayer,
        jangpuraVectorLayer,
      ],
    });
    yellowGroup.set('title', 'Yellow OFM');
    yellowGroup.set('fold', true);

    let redGroup = new LayerGroup({
      layers: [
        rajendraNagarBVectorLayer,
        rajendraNagarAVectorLayer,
        karolbaghVectorLayer,
        newDelhiVectorLayer,
      ],
    });
    redGroup.set('title', 'Red OFM');
    redGroup.set('fold', true);

    let OFMDistribution = new LayerGroup({
      layers: [this.delhiMap, redGroup, yellowGroup, blueGroup],
    });
    OFMDistribution.set('title', 'OFM Distribution');
    OFMDistribution.set('fold', true);
    this.geometryService.map.addLayer(OFMDistribution);

    /** Junction Box */
    let blueDistributionVectorLayer = this.addGeometryLayer(
      'Blue Junction',
      this.geometryService.blueDistributionVectorSource
    );
    let redDistributionVectorLayer = this.addGeometryLayer(
      'Red Junction',
      this.geometryService.redDistributionVectorSource
    );
    let yellowDistributionVectorLayer = this.addGeometryLayer(
      'Yellow Junction',
      this.geometryService.yellowDistributionVectorSource
    );

    let OFMJunction = new LayerGroup({
      layers: [
        yellowDistributionVectorLayer,
        redDistributionVectorLayer,
        blueDistributionVectorLayer,
      ],
    });
    OFMJunction.set('title', 'OFM Junction');
    OFMJunction.set('fold', true);
    this.geometryService.map.addLayer(OFMJunction);
  }

  public getAllOpticalData(): void {
    /** Junction Box */
    this.http.get(this.blueDistributionURL).subscribe((res) => {
      this.blueDistributionData = res;
      console.log('ddddd', res['features']);
      res['features'].forEach((element: any) => {
        this.geometryService.addPointFeatureDistribution(
          element,
          this.geometryService.blueDistributionVectorSource
        );
      });
    });
    this.http.get(this.redDistributionURL).subscribe((res) => {
      this.redDistributionData = res;
      console.log('ddddd', res);
      res['features'].forEach((element: any) => {
        this.geometryService.addPointFeatureDistribution(
          element,
          this.geometryService.redDistributionVectorSource
        );
      });
    });
    this.http.get(this.yellowDistributionURL).subscribe((res) => {
      this.yellowDistributionData = res;
      console.log('ddddd', res);
      res['features'].forEach((element: any) => {
        this.geometryService.addPointFeatureDistribution(
          element,
          this.geometryService.yellowDistributionVectorSource
        );
      });
    });

    /** Distribution Network */
    this.http.get(this.chandaniChaukAURL).subscribe((res) => {
      this.chandaniChaukAData = res;
      this.geometryService.addRouteFeature(
        this.chandaniChaukAData,
        this.geometryService.chandaniChaukAVectorSource
      );
    });
    this.http.get(this.chandaniChaukBURL).subscribe((res) => {
      this.chandaniChaukBData = res;
      this.geometryService.addRouteFeature(
        this.chandaniChaukBData,
        this.geometryService.chandaniChaukBVectorSource
      );
    });
    this.http.get(this.delhiCantURL).subscribe((res) => {
      this.delhiCantData = res;
      this.geometryService.addRouteFeature(
        this.delhiCantData,
        this.geometryService.delhiCantVectorSource
      );
    });
    this.http.get(this.jangpuraURL).subscribe((res) => {
      this.jangpuraData = res;
      this.geometryService.addRouteFeature(
        this.jangpuraData,
        this.geometryService.jangpuraVectorSource
      );
    });
    this.http.get(this.karolbaghURL).subscribe((res) => {
      this.karolbaghData = res;
      this.geometryService.addRouteFeature(
        this.karolbaghData,
        this.geometryService.karolbaghVectorSource
      );
    });
    this.http.get(this.newDelhiURL).subscribe((res) => {
      this.newDelhiData = res;
      this.geometryService.addRouteFeature(
        this.newDelhiData,
        this.geometryService.newDelhiVectorSource
      );
    });
    this.http.get(this.rajendraNagarAURL).subscribe((res) => {
      this.rajendraNagarAData = res;
      this.geometryService.addRouteFeature(
        this.rajendraNagarAData,
        this.geometryService.rajendraNagarAVectorSource
      );
    });
    this.http.get(this.rajendraNagarBURL).subscribe((res) => {
      this.rajendraNagarBData = res;
      this.geometryService.addRouteFeature(
        this.rajendraNagarBData,
        this.geometryService.rajendraNagarBVectorSource
      );
    });
    this.http.get(this.bijwasanAURL).subscribe((res) => {
      this.bijwasanAData = res;
      this.geometryService.addRouteFeature(
        this.bijwasanAData,
        this.geometryService.bijwasanAVectorSource
      );
    });
    this.http.get(this.bijwasanBURL).subscribe((res) => {
      this.bijwasanBData = res;
      this.geometryService.addRouteFeature(
        this.bijwasanBData,
        this.geometryService.bijwasanBVectorSource
      );
    });
    this.http.get(this.bijwasanCURL).subscribe((res) => {
      this.bijwasanCData = res;
      this.geometryService.addRouteFeature(
        this.bijwasanCData,
        this.geometryService.bijwasanCVectorSource
      );
    });
  }

  private addGeometryLayer(className: any, source: any): any {
    let mapLayer = new VectorLayer({
      className: className,
      source: source,
    });
    mapLayer.set('title', className);
    // mapLayer.set('visible', false);
    //this.geometryService.map.addLayer(mapLayer);
    return mapLayer;
  }

  public addMapControl(): void {
    let zoomToExtent = new ZoomToExtent({
      extent: [76.933695, 28.512569, 77.345999, 28.7038882],
    });
    this.geometryService.map.addControl(zoomToExtent);

    // let fullScreenControl = new FullScreen();
    // this.geometryService.map.addControl(fullScreenControl);

    var layerSwitcher = new LayerSwitcher({
      trash: true,
      reordering: true,
      noScroll: true,
      show_progress: true,
    });
    this.geometryService.map.addControl(layerSwitcher);

    var scaleControl = new ScaleLine({
      units: 'metric',
      bar: true,
      steps: 4,
      text: true,
      minWidth: 140,
    });
    this.geometryService.map.addControl(scaleControl);

    let mousePositionControl = new MousePosition({
      coordinateFormat: (coordinate: any) => {
        var dms = toStringHDMS(coordinate, 1);
        return format(
          coordinate,
          '<span>&nbsp; &nbsp;  <b> Latitude: </b> ' +
            coordinate[1].toFixed(6) +
            '&nbsp; &nbsp; </span><span>  <b>Longitude:</b> ' +
            coordinate[0].toFixed(6) +
            ' &nbsp; &nbsp; </span> <span> <b>DMS:</b>' +
            '(' +
            dms +
            ')' +
            ' &nbsp; &nbsp; </span> <span> <b>Zoom-Level :</b> ' +
            this.geometryService.map.getView().getZoom().toFixed(3) +
            ' &nbsp; &nbsp; </span> <span> ' +
            this.latlngToImgrs(coordinate[0], coordinate[1]) +
            ' &nbsp; &nbsp; </span> <span> <b>Projection :</b> ' +
            'EPSG:4326' +
            // ' </span> <span> <b>Slope :</b> ' +
            // 200 +
            '</span>'
        );
      },
      target: 'map-statusbar',
    });
    this.geometryService.map.addControl(mousePositionControl);
  }

  public addGeoJSON(): void {
    this.mapService.geoJSONData.forEach((data) => {
      let name = data.name;
      let coordinate = data.geometry.coordinates;
      this.geometryService.addPointFeature(coordinate, name);
    });
  }

  private addLayerSepratly(className: any, source: any): any {
    let mapLayer = new VectorLayer({
      className: className,
      source: source,
    });
    mapLayer.set('title', className);
    mapLayer.set('visible', true);
    this.geometryService.map.addLayer(mapLayer);
  }

  public filterLocations(event: any): any {
    const query = this.upper.transform(event.query);
    console.log(query);

    const cqlFilter = `ac_name LIKE '%${query}%'`;
    const wfsUrl =
      'http://localhost:8080/geoserver/ows?service=WFS&' +
      'version=1.1.0&request=GetFeature&typeName=ne:Delhi_map&outputFormat=application/json';

    this.http.get(wfsUrl, { params: { CQL_FILTER: cqlFilter } }).subscribe(
      (data: any) => {
        // let features = new GeoJSON().readFeatures(data);
        let json = data.features;
        let dataArray: string[] = [];
        for (let i = 0; i < json.length; i++) {
          dataArray.push(json[i].properties.ac_name);
        }
        this.filteredLocations = dataArray.map((location) => ({
          label: location,
          value: location,
        }));
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  public selectedOption(event: any): any {
    let vectorLayer: any;
    this.vectorSource?.refresh();
    this.vectorSource?.refresh();
    let selectOption = event.value;
    console.log('Selected Option : ' + selectOption);
    let cqlFilter = `ac_name = '${selectOption}'`;
    const wfsUrl =
      `http://localhost:8080/geoserver/ows?service=WFS&` +
      'version=1.1.0&request=GetFeature&typeName=ne:Delhi_map&outputFormat=application/json';
    this.http
      .get(wfsUrl, {
        params: {
          CQL_FILTER: cqlFilter,
        },
      })
      .subscribe((data: any) => {
        let features = new GeoJSON().readFeatures(data);
        this.vectorSource.addFeatures(features);
        vectorLayer = new VectorLayer({
          source: this.vectorSource,
        });

        let style = new Style({
          fill: new Fill({
            color: 'rgba(0,0,128,0.25)',
          }),
          stroke: new Stroke({
            color: 'rgba(0,0,128)',
            width: 3,
          }),
        });
        vectorLayer.setStyle(style);
        let extent = this.vectorSource.getExtent();
        this.geometryService.map.addLayer(vectorLayer);
        let center = getCenter(extent);
        const mapView = this.geometryService.map.getView();
        mapView.animate({
          center: center,
          duration: 1500,
          zoom: 13,
        });
        this.iconSource = new VectorSource({
          features: [
            new Feature({
              geometry: new Point(center),
            }),
          ],
        });

        const iconLayer = new VectorLayer({
          source: this.iconSource,
          style: new Style({
            image: new Icon({
              src: 'assets/images/Location.svg', // Provide the path to your icon image
              scale: 0.75, // Adjust the scale of the icon as needed
            }),
          }),
        });
        this.geometryService.map.addLayer(iconLayer);
      });
    setTimeout(() => {
      this.vectorSource?.refresh();
      this.vectorSource?.refresh();
      this.iconSource?.refresh();
    }, 10000);
  }

  public setDefaultView(): void {
    const mapView = this.geometryService.map.getView();
    mapView.animate({
      center: [77.14, 28.607],
      duration: 1500,
      zoom: 12,
    });
  }

  public latlngToImgrs(lng: any, lat: any): string {
    var zone_0_lat_min = 35.58;
    var zone_0_lat_max = 50;
    var zone_IA_lat_min = 28;
    var zone_IA_lat_max = 35.58;
    var zone_IA_lon_max = 82;
    var zone_IB_lat_min = 28;
    var zone_IB_lat_max = 35.58;
    var zone_IB_lon_min = 82;
    var zone_IIA_lat_min = 21;
    var zone_IIA_lat_max = 28;
    var zone_IIA_lon_max = 82;
    var zone_IIB_lat_min = 21;
    var zone_IIB_lat_max = 28;
    var zone_IIB_lon_min = 82;
    var zone_IIIA_lat_min = 15;
    var zone_IIIA_lat_max = 21;
    var zone_IIIA_lon_max = 90;
    var zone_IIIB_lat_min = 15;
    var zone_IIIB_lat_max = 21;
    var zone_IIIB_lon_min = 90;
    var zone_IVA_lat_min = 5;
    var zone_IVA_lat_max = 15;
    var zone_IVA_lon_max = 90;
    var zone_IVB_lat_min = 5;
    var zone_IVB_lat_max = 15;
    var zone_IVB_lon_min = 90;

    var firstProjection = '';
    var x = lng;
    var y = lat;
    let zone = '';

    if (y >= zone_0_lat_min && y < zone_0_lat_max) {
      zone = '0';
      firstProjection =
        '+proj=lcc +lat_1=39.5 +lat_0=39.5 +lon_0=68 +k_0=0.99846154 +x_0=2153866.4 +y_0=2368292.9 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs';
    } else if (
      y >= zone_IA_lat_min &&
      y < zone_IA_lat_max &&
      x < zone_IA_lon_max
    ) {
      zone = 'IA';
      firstProjection =
        '+proj=lcc +lat_1=32.5 +lat_0=32.5 +lon_0=68 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs';
    } else if (
      y >= zone_IB_lat_min &&
      y < zone_IB_lat_max &&
      x >= zone_IB_lon_min
    ) {
      zone = 'IB';
      firstProjection =
        '+proj=lcc +lat_1=32.5 +lat_0=32.5 +lon_0=90 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs';
    } else if (
      y >= zone_IIA_lat_min &&
      y < zone_IIA_lat_max &&
      x < zone_IIA_lon_max
    ) {
      zone = 'IIA';
      firstProjection =
        '+proj=lcc +lat_1=26 +lat_0=26 +lon_0=74 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs';
    } else if (
      y >= zone_IIB_lat_min &&
      y < zone_IIB_lat_max &&
      x >= zone_IIB_lon_min
    ) {
      zone = 'IIB';
      firstProjection =
        '+proj=lcc +lat_1=26 +lat_0=26 +lon_0=90 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs';
    } else if (
      y >= zone_IIIA_lat_min &&
      y < zone_IIIA_lat_max &&
      x < zone_IIIA_lon_max
    ) {
      zone = 'IIIA';
      firstProjection =
        '+proj=lcc +lat_1=19 +lat_0=19 +lon_0=80 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs';
    } else if (
      y >= zone_IIIB_lat_min &&
      y < zone_IIIB_lat_max &&
      x >= zone_IIIB_lon_min
    ) {
      zone = 'IIIB';
      firstProjection =
        '+proj=lcc +lat_1=19 +lat_0=19 +lon_0=100 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs';
    } else if (
      y >= zone_IVA_lat_min &&
      y < zone_IVA_lat_max &&
      x < zone_IVA_lon_max
    ) {
      zone = 'IVA';
      firstProjection =
        '+proj=lcc +lat_1=12 +lat_0=12 +lon_0=80 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs';
    } else if (
      y >= zone_IVB_lat_min &&
      y < zone_IVB_lat_max &&
      x >= zone_IVB_lon_min
    ) {
      zone = 'IVB';
      firstProjection =
        '+proj=lcc +lat_1=12 +lat_0=12 +lon_0=104 +k_0=0.99878641 +x_0=2743195.5 +y_0=914398.5 +a=6377299.151 +b=6356098.145120132 +towgs84=295,736,257,0,0,0,0 +units=m +no_defs';
    }
    var secondProjection = '+proj=longlat +datum=WGS84 +no_defs';
    var test = proj4(secondProjection, firstProjection, [x, y]);
    var test2 = proj4(firstProjection, secondProjection, [1935999, 633999]);
    var x1: any = parseInt(test[0]);
    var y1: any = parseInt(test[1]);

    var x2: any = x1 % 100000;
    var y2: any = y1 % 100000;

    var x3: any = x1 / 100000;
    var y3: any = y1 / 100000;

    var x4 = Math.abs(parseInt(String(x3 / 5)) % 5);
    var y4 = Math.abs(parseInt(String(y3 / 5)) % 5);

    var x5 = Math.abs(parseInt(x3) % 5);
    var y5 = Math.abs(parseInt(y3) % 5);

    var index = [
      ['V', 'Q', 'L', 'F', 'A'],
      ['W', 'R', 'M', 'G', 'B'],
      ['X', 'S', 'N', 'H', 'C'],
      ['Y', 'T', 'O', 'J', 'D'],
      ['Z', 'U', 'P', 'K', 'E'],
    ];

    var imgrs_string =
      ' <b>MGRS</b> (' +
      index[x4][y4] +
      index[x5][y5] +
      ' ' +
      x2 +
      ' ' +
      y2 +
      ')';
    return imgrs_string;
  }
}
