"use client";

import {Paper} from "@mui/material";
import Grid from "@mui/material/Grid";

import Map from "@/components/Map/Map";
import {InstitutionEntry, Metrics} from "@/app/types";
import {OSDFNetworkMapProvider} from "@/components/OSDFNetworkMap/OSDFNetworkMapContext";
import InstitutionLayer from "@/components/InstitutionLayer";
import InstitutionList from "@/components/InstitutionList";
import Legend from "@/components/Legend";
import ViewToggle from "@/components/ViewToggle";

interface SiteNetworkMapProps {
  institutions: InstitutionEntry[];
  totalMetrics: Metrics;
  date: Date;
}

const SiteNetworkMap = ({institutions, totalMetrics, date}: SiteNetworkMapProps) => {

  return (
    <OSDFNetworkMapProvider>
      <Grid container>
        <Grid size={9}>
          <Map>
            <InstitutionLayer institutions={institutions} />
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
            <InstitutionList institutions={institutions} totalMetrics={totalMetrics} />
          </Paper>
        </Grid>
      </Grid>
      <ViewToggle active={"sites"} />
      <Legend date={date} variant={"sites"} />
    </OSDFNetworkMapProvider>
  )
}

export default SiteNetworkMap;
