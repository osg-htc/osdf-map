"use client";

import {Box, Paper} from '@mui/material';
import {Marker} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import {MetricPoint} from "@/app/types";
import {ReactNode, useState} from "react";
import Typography from "@mui/material/Typography";
import {byteString} from "@/util";

interface ExecutionPointMarkerProps {
  point: MetricPoint;
  /** Rendered inside the (otherwise invisible) hover target, e.g. a server icon. */
  icon?: ReactNode;
  subtitle?: string;
}

const ExecutionPointMarker = ({point, icon, subtitle}: ExecutionPointMarkerProps) => {

  const [hovered, setHovered] = useState(false);

  return (
    <Marker
      key={`point-${point.latitude}-${point.longitude}-marker`}
      latitude={point.latitude}
      longitude={point.longitude}
      color="#FF5733"
      offset={[0, 0]}
    >
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{height: 20, width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        {icon}
        {hovered &&
          <Paper elevation={3} sx={{borderRadius: 2, display: 'flex', flexDirection: 'column', position: 'absolute', top: -50, left: 25, padding: 1, zIndex: 10000, width: "260px"}}>
            <Typography variant="h6" color={"primary"}>{point.name}</Typography>
            {subtitle &&
              <Typography variant={'caption'} color={'text.secondary'} mb={0.5}>{subtitle}</Typography>
            }
            <Typography variant={'subtitle2'}>
              {point.count.toLocaleString()} Jobs
            </Typography>
            <Typography variant={'subtitle2'}>
              {byteString(point.bytes)} Bytes
            </Typography>
            <Typography variant={'subtitle2'}>
              {point.objects.toLocaleString()} Objects
            </Typography>
          </Paper>
        }
      </Box>
    </Marker>
  )
}

export default ExecutionPointMarker;
