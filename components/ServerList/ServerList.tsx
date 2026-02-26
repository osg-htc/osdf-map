import {useOSDFNetworkMap} from "@/components/OSDFNetworkMap/OSDFNetworkMapContext";
import {useMap} from "react-map-gl/mapbox";
import {EnhancedEndpointEntry, Metrics} from "@/app/types";
import {Box} from "@mui/material";
import {Storage, TripOrigin} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {byteString} from "@/util";
import {useEffect, useRef} from "react";

interface ServerListProps {
  siteMap: EnhancedEndpointEntry[];
  totalMetrics: Metrics;
}

const ServerList = ({siteMap, totalMetrics}: ServerListProps) => {
  const {state: {activeSiteIndex}, dispatch} = useOSDFNetworkMap();

  const sitesWithServers = siteMap.filter(endpointEntry => endpointEntry.server);
  const {current: map} = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEntry = siteMap[activeSiteIndex];
    if (!activeEntry?.server?.name || !containerRef.current) return;
    const el = containerRef.current.querySelector(`#${CSS.escape(activeEntry.server.name)}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeSiteIndex]);

  return (
    <Box ref={containerRef} overflow="auto" p={2}>
      {siteMap.map((e, i) => {
        return (
          <Box key={e.server?.name} id={e.server?.name} display="flex" justifyContent="space-between" flexDirection={'column'} mb={2} overflow="hidden" onClick={() => {dispatch({ type: 'SET_ACTIVE_SITE', index: i, total: sitesWithServers.length }); if(map && e.server){ map.flyTo({center: [e.server.longitude, e.server.latitude]}); }}} sx={{cursor: 'pointer', backgroundColor: i === activeSiteIndex ? "rgba(0,0,0,0.08)" : "transparent", borderRadius: 1, p: 1}}>
            <Box display={'flex'} mr={1} my={"auto"}>
              { e.server?.type == "Cache" ? <Storage color={"primary"} fontSize={'small'} /> : <TripOrigin color={"primary"} fontSize={'small'}/> }
              <Typography sx={{ml:1}} variant={'subtitle2'}>
                {e.server?.type}
              </Typography>
            </Box>
            <Typography
              variant={"h6"}
              color={'primary'}
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
              title={e.server?.name}
            >
              {e.server?.name}
            </Typography>
            <Box>
              <Grid container gap={2} justifyContent="flex-start">
                <Grid>
                  <Box>
                    <Typography variant={"subtitle2"}>
                      {e.summary.count.toLocaleString()} Jobs
                    </Typography>
                  </Box>
                </Grid>
                <Grid>
                  <Box>
                    <Typography variant={"subtitle2"}>
                      {byteString(e.summary.bytes)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid>
                  <Box>
                    <Typography variant={"subtitle2"}>
                      {e.summary.objects.toLocaleString()} Objects
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )
      })}
    </Box>

  )
}

export default ServerList;
