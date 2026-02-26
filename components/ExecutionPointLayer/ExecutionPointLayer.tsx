"use client";

import {Source, Layer} from 'react-map-gl/mapbox';
import type {Feature} from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Institution, Metrics} from "@/app/types";
import {useEffect, useState} from "react";

interface ExecutionPointLayerProps {
  targetRadius?: number;
  expansionDuration?: number;
  institutions: Institution[];
}

const ExecutionPointLayer = ({
  institutions,
  targetRadius = 3000,
  expansionDuration = 2000
}: ExecutionPointLayerProps) => {

  const [features, setFeatures] = useState<Feature[]>([]);

  const maxObjects = Math.max(...institutions.map(i => i.objects), 1); // Avoid division by zero

  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;

    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / expansionDuration);
      const features = institutions.map(institution => getCircleFeature(institution, maxObjects, targetRadius, t));
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
  }, [institutions, expansionDuration]);

  return (
    <Source id="execution-points" type="geojson" data={{type: 'FeatureCollection', features}}>
      <Layer type="circle" paint={{'circle-color': "#c3ffad", 'circle-opacity': .5, 'circle-stroke-color': "#3fa629", 'circle-stroke-width': 2, 'circle-radius': ['get', 'radius']}} />
    </Source>
  )
}

const getCircleFeature = (institution: Institution, maxObjects: number, maxRadius: number, scalingFactor: number): Feature => {

  const area = (maxRadius * (institution.objects / maxObjects)) * scalingFactor;
  const radius = Math.sqrt(area / Math.PI);

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [institution.longitude, institution.latitude]
    },
    properties: {
      radius: Math.max((Math.sqrt(maxRadius / Math.PI)) / 3, radius)
    }
  }
}

export default ExecutionPointLayer;
