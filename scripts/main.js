/*
  Program: main.js
  Programmer: Becket Osterland
  Date: April 14, 2022
  Purpose: Script for ArcGIS JavaScript API webmap
*/

require([
    "esri/config",
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/Home",
    "esri/widgets/BasemapToggle",
    "esri/widgets/LineOfSight",
    "esri/widgets/Daylight",
    "esri/widgets/Expand",
  ], (esriConfig, Map, SceneView, FeatureLayer, Legend, Home, BasemapToggle, LineOfSight, Daylight, Expand) => {

    // API Key INSERT HERE
    esriConfig.apiKey = "AAPK218290a70ecd4e399d2a3fa8f77b6f38JdSwO4yTnn2c8pDLajJjWHZwWkvPFujqcJeg3Asp-bY8PSBxlXotZP3hehur59oF";

    //Create custom renderer for buildings
    //  **************************  //
    //Uses visualVariables to declare size of extrusion to height field (feet)
    //Uses contruction year field to define color

     const rendererBuildings = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: {
        type: "polygon-3d", // autocasts as new PolygonSymbol3D()
        symbolLayers: [{ type: "extrude" }] // autocasts as new ExtrudeSymbol3DLayer()
      },
      label: "Height of building (ft) and Construction Year",
      visualVariables: [
        {
          type: "size", // indicates this is a size visual variable
          field: "heightroof", // heightroof variable
          valueUnit: "feet" //height is in US feet
        },
        {
          type: "color", 
          field: "cnstrct_yr",
          label: "Construction Year",
          stops: [ //color gradient stops defined
            {
              value: 0, //many buildings without year information, set to gray/NA
              color: "#ccc",
              label: "NA"
            },
            {
              value: 1750, //buildings around built in 1750 will be yellow
              color: "#F3E24C",
              label: "1750"
            },
            {
              value: 1800,
              color: "#D84F25",
              label: "1800"
            },
            {
              value: 1900,
              color: "#8B18D8",
              label: "1900"
            },
            {
              value: 2000, //buildings around built in 2000 will be light blue
              color: "#81C8F5",
              label: "2000"
            }
          ]
        }
      ]
    };

    //Create custom renderer for subway station entrances
    const rendererSubway = {
      type: "simple",
      symbol: {
        type: "web-style", 
        styleName: "EsriRealisticStreetSceneStyle",
        name: "Bus_Stop_1" //uses esri bus stop 3D symbol
      },
      label: "Subway Entrance"
    }
   
    // Call building layer from rest services
    // Set the renderer on the layer
    const buildingsLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/JZXDSJLYSVmOYKTS/arcgis/rest/services/lower_manhattan/FeatureServer/0",
      renderer: rendererBuildings,
      elevationInfo: {
        mode: "on-the-ground"
      },
      title: "Extruded building footprints",
      popupTemplate: { //popup
        title: "{name}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "cnstrct_yr",
                label: "Construction Year"
              },
              {
                fieldName: "heightroof",
                label: "Height (ft)"
              }
            ]
          }
        ]
      },
      outFields: ["cnstrct_yr", "heightroof"]
    });

    // Call subway layer from rest services
    // Set the renderer on the layer
    const subwayLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/JZXDSJLYSVmOYKTS/arcgis/rest/services/nycsubwayentrances/FeatureServer/0",
      renderer: rendererSubway,
      elevationInfo: {
        mode: "on-the-ground"
      },
      title: "NYC Subway Entrances",
      popupTemplate: { //popup
        title: "{name}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "line",
                label: "Line(s)"
              },
              {
                fieldName: "url",
                label: "Station link"
              }
            ]
          }
        ]
      },
      outFields: ["line", "url"]
    });

    /* MAP */
    //Calls for new Map with dark basemap
    //adds layers to map
    const map = new Map({
        basemap: "arcgis-dark-gray",
        ground: "world-elevation",
        layers: [buildingsLayer, subwayLayer]
    });

    //new 3D SceneView
    const view = new SceneView({
      container: "viewDiv",
      map: map,
      //set camera properties
      camera: {
        position: [-74.015, 40.685, 1400],
        tilt: 60,
        heading: 15
      }
    });


    /* WIDGETS*/
    //Legend widget
    const legend = new Legend({
      view: view
    });
    //add legend to ui
    view.ui.add(legend, "bottom-right");


    //Home Widget
    const homeWidget = new Home({
      view: view
    });
    // adds the home widget to the top left corner of the MapView
    view.ui.add(homeWidget, "top-left");

    //Toggle Basemap widget
    const basemapToggle = new BasemapToggle({
      view: view,  
      nextBasemap: "arcgis-newspaper"  // Allows for toggling to the "newspaper" basemap
    });
    //adds basemap toggle widget to view
    view.ui.add(basemapToggle, {
      position: "top-right"});

    // Line of Sight widget
    const lineOfSight = new LineOfSight({
      view: view
    });
    //Add expand widget to line of sight
    const lineofSightExpand = new Expand({
      view: view,
      content: lineOfSight
    });
    // Add the expand instance to the ui
    view.ui.add(lineofSightExpand, "top-right");  

    //Daylight widget
    const daylightWidget = new Daylight({
      view: view
    });
    //Add expand widget to line of sight
    const daylightExpand = new Expand({
      view: view,
      content: daylightWidget
    });
    // Add the expand instance to the ui
    view.ui.add(daylightExpand, "top-right");

  });
