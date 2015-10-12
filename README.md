# Bay Area Neighborhood Finder
[Live Link][live]

[live]: http://katamartin.github.io/ZillowNeighborhoods/index.html

## Summary

Neighborhood boundaries are shown over a map of the San Francisco Bay Area.
Searching for locations within San Francisco and Oakland displays a marker with
the containing neighborhood's name.

## Shapefile Processing

[Zillow Shapefiles][shapefiles] for California neighborhood boundaries were
converted to geoJSON for easy overlay with Google Maps using GDAL. The features
were first filtered to just those contained by San Francisco and Oakland using
following command:
'''
ogr2ogr -where 'NAME = San Francisco OR NAME = Oakland' subset.shp ZillowNeighborhoods-CA.shp
'''
The resultant Shapefile was then converted to geoJSON again using GDAL:

'''
ogr2ogr2 -f GeoJSON -t-srs EPSG:4269 subset.geojson subset.shp
'''

[shapefiles]: http://www.zillow.com/howto/api/neighborhood-boundaries.htm
