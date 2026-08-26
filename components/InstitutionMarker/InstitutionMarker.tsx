"use client";

import {Business, Storage} from '@mui/icons-material';
import {Box} from '@mui/material';
import {Marker as MbMarker} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import {InstitutionEntry} from "@/app/types";
import ConnectionLayer from "@/components/ConnectionLayer";
import ExecutionPointLayer from "@/components/ExecutionPointLayer";
import ExecutionPointMarker from "@/components/ExecutionPointMarker";

export interface InstitutionMarkerProps {
  institution: InstitutionEntry;
  active: boolean;
  /** Draw the fan-out to every cache this institution pulled from. */
  showConnections: boolean;
  onClick?: (id: string) => void;
}

const InstitutionMarker = ({institution, active, showConnections, onClick}: InstitutionMarkerProps) => {

  const {latitude, longitude, servers} = institution;

  const validConnections = servers.map(s => ({latitude: s.latitude, longitude: s.longitude}));

  return (
    <MbMarker
      key={`${latitude}-${longitude}-institution-marker`}
      latitude={latitude}
      longitude={longitude}
      color="#3fa629"
      offset={[0, 0]}
      onClick={() => onClick && onClick(institution.id)}
      style={{
        cursor: 'pointer',
      }}
    >
      <Box zIndex={99999999}>
        {active ?
          <Box sx={{backgroundColor: "black", borderRadius: "50%", padding: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1001}}>
            <Business sx={{color: "#65b853"}} />
          </Box> :
          <Box sx={{ borderRadius: "50%", padding: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1000}}>
            <Business sx={{ color: "rgba(0,0,0,0.24)"}} fontSize={'small'} />
          </Box>
        }
        { showConnections && servers.length > 0 && (
          <ConnectionLayer origin={{latitude, longitude}} destinations={validConnections} />
        )}
        { showConnections && servers.length > 0 && (
          <ExecutionPointLayer
            points={servers}
            expansionDuration={5000}
            sourceId={"pulled-from-servers"}
            fillColor={"#ffc9bb"}
            strokeColor={"#FF5733"}
          />
        )}
        { showConnections && servers.map((server) => (
          <ExecutionPointMarker
            key={server.name}
            point={server}
            subtitle={"Cache"}
            icon={<Storage sx={{color: "#FF5733"}} fontSize={'small'} />}
          />
        ))}
      </Box>
    </MbMarker>
  )
}

export default InstitutionMarker;
