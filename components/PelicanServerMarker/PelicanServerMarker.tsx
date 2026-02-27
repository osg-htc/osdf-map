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
  active: boolean;
  showInstitutions: boolean;
  showConnections: boolean;
  institutions: Institution[];
  totalMetrics: Metrics;
  onClick?: (name: string) => void;
}

const PelicanServerMarker = ({name, type, active, latitude, longitude, institutions, showInstitutions, showConnections, onClick}: PelicanServerMarkerProps) => {

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
      onClick={() => onClick && onClick(name)}
      style={{
        cursor: 'pointer',
      }}
    >
      <Box zIndex={99999999}>
        {active ?
          <Box sx={{backgroundColor: "black", borderRadius: "50%", padding: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1001}}>
            { type == "Cache" ? <Storage color={"primary"} /> : <TripOrigin color={"primary"}/> }
          </Box> :
          <Box sx={{ borderRadius: "50%", padding: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1000}}>
            { type == "Cache" ? <Storage sx={{ color: "rgba(0,0,0,0.24)"}} fontSize={'small'} /> : <TripOrigin sx={{ color: "rgba(0,0,0,0.24)"}} fontSize={'small'}/> }
          </Box>
        }
        { showConnections && institutions && (
          <ConnectionLayer origin={{latitude, longitude}} destinations={validConnections} />
        )}
        { showConnections && institutions && (
          <ExecutionPointLayer institutions={institutions} expansionDuration={5000} />
        )}
        { showConnections && institutions &&
          institutions.map((institution) => (
            <ExecutionPointMarker key={institution.name} institution={institution} />
          ))
        }
      </Box>
    </MbMarker>
  )
}

export default PelicanServerMarker;
