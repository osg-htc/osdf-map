"use client";

import {Source, Layer} from 'react-map-gl/mapbox';
import type {Feature} from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ConnectionLayerProps {
  origin: {
    latitude: number;
    longitude: number;
  };
  destinations: {
    latitude: number;
    longitude: number;
  }[];
}

const ConnectionLayer = ({origin, destinations}: ConnectionLayerProps) => {

  const features: Feature[] = destinations.map((destination, index) => ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [origin.longitude, origin.latitude],
        [destination.longitude, destination.latitude]
      ]
    },
    properties: {
      id: `connection-${index}`
    }
  }));

  return (
    <Source id="connections" type="geojson" data={{type: 'FeatureCollection', features}}>
      <Layer type="line" paint={{'line-color': '#FF5733', 'line-width': 2, 'line-opacity': .4}} />
    </Source>
  )
}

export default ConnectionLayer;
