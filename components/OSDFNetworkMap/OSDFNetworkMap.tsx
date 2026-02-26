"use client";

import Map from "@/components/Map/Map";
import ServerSiteLayer from "@/components/ServerLayer/ServerLayer";
import {Box, Paper} from "@mui/material";
import {EnhancedEndpointEntry, Metrics} from "@/app/types";
import {OSDFNetworkMapProvider, useOSDFNetworkMap} from "@/components/OSDFNetworkMap/OSDFNetworkMapContext";
import {useMap} from "react-map-gl/mapbox";
import ServerList from "@/components/ServerList";
import Grid from "@mui/material/Grid";

interface OSDFNetworkMapProps {
  siteMap: EnhancedEndpointEntry[];
  totalMetrics: Metrics;
}

const OSDFNetworkMap = ({siteMap, totalMetrics}: OSDFNetworkMapProps) => {

  return (
    <OSDFNetworkMapProvider>
      <Grid container>
        <Grid size={9}>
          <Map>
            <ServerSiteLayer siteMap={siteMap} totalMetrics={totalMetrics} />
          </Map>
        </Grid>
        <Grid size={3}>
          <Paper
            elevation={1}
            sx={{
              borderRadius: 3,
              overflow: 'auto',
              m: 1,
              height: "98vh",
            }}
          >
            <ServerList siteMap={siteMap} totalMetrics={totalMetrics} />
          </Paper>
        </Grid>
      </Grid>
    </OSDFNetworkMapProvider>
  )
}

export default OSDFNetworkMap;