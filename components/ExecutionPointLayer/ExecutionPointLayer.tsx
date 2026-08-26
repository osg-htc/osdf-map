"use client";

import {Source, Layer} from 'react-map-gl/mapbox';
import type {Feature} from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import {MetricPoint} from "@/app/types";
import {useEffect, useState} from "react";

interface ExecutionPointLayerProps {
  targetRadius?: number;
  expansionDuration?: number;
  points: MetricPoint[];
  sourceId?: string;
  fillColor?: string;
  strokeColor?: string;
}

const ExecutionPointLayer = ({
  points,
  targetRadius = 3000,
  expansionDuration = 2000,
  sourceId = "execution-points",
  fillColor = "#c3ffad",
  strokeColor = "#3fa629"
}: ExecutionPointLayerProps) => {

  const [features, setFeatures] = useState<Feature[]>([]);

  const maxObjects = Math.max(...points.map(p => p.objects), 1); // Avoid division by zero

  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;

    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / expansionDuration);
      const features = points.map(point => getCircleFeature(point, maxObjects, targetRadius, t));
      setFeatures(features);
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    // reset and start animation
    setFeatures(features);
    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [points, expansionDuration]);

  return (
    <Source id={sourceId} type="geojson" data={{type: 'FeatureCollection', features}}>
      <Layer type="circle" paint={{'circle-color': fillColor, 'circle-opacity': .5, 'circle-stroke-color': strokeColor, 'circle-stroke-width': 2, 'circle-radius': ['get', 'radius']}} />
    </Source>
  )
}

const getCircleFeature = (point: MetricPoint, maxObjects: number, maxRadius: number, scalingFactor: number): Feature => {

  const area = (maxRadius * (point.objects / maxObjects)) * scalingFactor;
  const radius = Math.sqrt(area / Math.PI);

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [point.longitude, point.latitude]
    },
    properties: {
      radius: Math.max((Math.sqrt(maxRadius / Math.PI)) / 3, radius)
    }
  }
}

export default ExecutionPointLayer;
