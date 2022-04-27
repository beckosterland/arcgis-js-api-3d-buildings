# Data-driven extruded building footprints in ArcGIS JS API
## 3D mapping example of Lower Manhattan

This webmap centers on the buildings in Lower Manhattan (below Houston Street). The ArcGIS JavaScript API is used to 
call a WebScene (3D), add data layers hosted on my Esri acccount, symbolize those layers and add widgets to do things
like change the basemap, show the effects of sunlight and shadows, create a viewshed etc.

The building footprints layer is symbolized by extruding polygons to the height field embedded in the dataset (in US feet).
The layer is then coloured by its year of contruction with warmer colours showing the oldest buildings (1750s) and the colder blue/purple shades
showing newer built structures.
Also included is a layer showing the location of Subway station entrances, symbolized by Esri's 3D point layer feature, in this case a bus stop.

Map created by Beck Osterland - 2022   
Data source: [NYC Open Data Portal](https://opendata.cityofnewyork.us/)
