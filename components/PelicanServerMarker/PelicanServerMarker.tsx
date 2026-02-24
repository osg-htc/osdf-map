"use client";

import {Storage, TripOrigin} from '@mui/icons-material';
import {Box} from '@mui/material';
import {Marker as MbMarker} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Institution, Metrics, Marker} from "@/app/types";
import ConnectionLayer from "@/components/ConnectionLayer/ConnectionLayer";
import ExecutionPointLayer from "@/components/ExecutionPointLayer";
import ExecutionPointMarker from "@/components/ExecutionPointMarker";

export interface PelicanServerMarkerProps extends Marker {
  name: string;
  type: "Cache" | "Origin";
  showInstitutions: boolean;
  showConnections: boolean;
  institutions: Institution[];
  totalMetrics: Metrics;
}

const PelicanServerMarker = ({name, type, latitude, longitude, institutions, showInstitutions, showConnections}: PelicanServerMarkerProps) => {

  // Filter out institutions that don't have valid latitude and longitude
  const validConnections = institutions
    .map(c => ({latitude: c.latitude, longitude: c.longitude}))

  return (
    <MbMarker
      key={`${latitude}-${longitude}-apmarker`}
      latitude={latitude}
      longitude={longitude}
      color="#FF5733"
      offset={[0, 0]}
      onClick={() => console.log(location)}
    >
      <Box>
        <Box sx={{backgroundColor: "black", borderRadius: "50%", padding: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          { type == "Cache" ? <Storage color={"primary"} fontSize={'large'} /> : <TripOrigin color={"primary"} fontSize={'large'}/> }
        </Box>
        { showConnections && institutions && (
          <ConnectionLayer origin={{latitude, longitude}} destinations={validConnections} />
        )}
        { showInstitutions && institutions && (
          <ExecutionPointLayer institutions={institutions} expansionDuration={5000} />
        )}
        {institutions &&
          institutions.map((institution) => (
            <ExecutionPointMarker institution={institution} />
          ))
        }
      </Box>
    </MbMarker>
  )
}

export default PelicanServerMarker;
