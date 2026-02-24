"use client";

import {Box, Paper} from '@mui/material';
import {Marker} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Institution} from "@/app/types";
import {useState} from "react";
import Typography from "@mui/material/Typography";
import {byteString} from "@/util";

interface ExecutionPointMarkerProps {
  institution: Institution;
  onHover?: (institution: Institution | null) => void;
}

const ExecutionPointMarker = ({institution}: ExecutionPointMarkerProps) => {

  const [hovered, setHovered] = useState(false);

  return (
    <Marker
      key={`institution-${institution.latitude}-${institution.longitude}-marker`}
      latitude={institution.latitude}
      longitude={institution.longitude}
      color="#FF5733"
      offset={[0, 0]}
      onClick={() => console.log(location)}
    >
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{height: 20, width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        {hovered &&
          <Paper elevation={3} sx={{borderRadius: 2, display: 'flex', flexDirection: 'column', position: 'absolute', top: -50, left: 25, padding: 1, zIndex: 10000, width: "260px"}}>
            <Typography variant="h6" color={"primary"}>{institution.name}</Typography>
            <Typography variant={'subtitle2'}>
              {institution.count.toLocaleString()} Jobs
            </Typography>
            <Typography variant={'subtitle2'}>
              {byteString(institution.bytes)} Bytes
            </Typography>
            <Typography variant={'subtitle2'}>
              {institution.objects.toLocaleString()} Objects
            </Typography>
          </Paper>
        }
      </Box>
    </Marker>
  )
}

export default ExecutionPointMarker;