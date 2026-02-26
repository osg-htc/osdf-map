"use client";

import {Source, Layer} from 'react-map-gl/mapbox';
import {useMap} from 'react-map-gl/mapbox';
import type {Feature} from 'geojson';
import type {ExpressionSpecification} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useEffect, useRef} from 'react';

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

const ANIMATION_DURATION = 3000;
const PULSE_WIDTH = 0.15;
const GAP = 0.005;
const LINE_LAYER_ID = 'connections-animated';
const SOLID_LAYER_ID = 'connections-solid-line';

function buildGradient(t: number): ExpressionSpecification {
  const head = t;
  const tail = Math.max(0, t - PULSE_WIDTH);

  // Strictly ascending stops, each nudged at least GAP apart
  const s0 = 0;
  const s1 = Math.max(s0 + GAP, tail - GAP);
  const s2 = Math.max(s1 + GAP, tail);
  const s3 = Math.max(s2 + GAP, head);
  const s4 = Math.min(1, s3 + GAP);

  // All 5 positions must be distinct — fall back to transparent if t is too small
  if (s3 <= s0 + GAP * 3) {
    return ['interpolate', ['linear'], ['line-progress'], 0, 'rgba(255,87,51,0)', 1, 'rgba(255,87,51,0)'] as ExpressionSpecification;
  }

  return [
    'interpolate', ['linear'], ['line-progress'],
    s0, 'rgba(255,87,51,0)',
    s1, 'rgba(255,87,51,0.2)',
    s2, 'rgba(255,87,51,0.4)',
    s3, 'rgba(255,87,51,0.2)',
    s4, 'rgba(255,87,51,0)',
  ] as ExpressionSpecification;
}

const ConnectionLayer = ({origin, destinations}: ConnectionLayerProps) => {
  const {current: map} = useMap();
  const animFrameRef = useRef<number>(null);

  useEffect(() => {
    if (!map) return;

    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const t = ((timestamp - start) % ANIMATION_DURATION) / ANIMATION_DURATION;
      const mbMap = map.getMap();
      if (mbMap.getLayer(LINE_LAYER_ID)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mbMap as any).setPaintProperty(LINE_LAYER_ID, 'line-gradient', buildGradient(t));
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, [map]);

  const lines: Feature[] = destinations.map((destination, index) => ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [origin.longitude, origin.latitude],
        [destination.longitude, destination.latitude]
      ]
    },
    properties: { id: `connection-${index}` }
  }));

  return (
    <>
      {/* Solid dim base line */}
      <Source id="connections-solid" type="geojson" data={{type: 'FeatureCollection', features: lines}}>
        <Layer id={SOLID_LAYER_ID} type="line" paint={{'line-color': '#FF5733', 'line-width': 2, 'line-opacity': 0.2}} />
      </Source>
      {/* Animated gradient pulse line — lineMetrics required for line-gradient */}
      <Source id="connections" type="geojson" lineMetrics={true} data={{type: 'FeatureCollection', features: lines}}>
        <Layer
          id={LINE_LAYER_ID}
          type="line"
          layout={{'line-cap': 'round'}}
          paint={{
            'line-width': 2,
            'line-gradient': buildGradient(0),
          }}
        />
      </Source>
    </>
  );
}

export default ConnectionLayer;


