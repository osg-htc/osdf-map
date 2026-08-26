import {useEffect, useRef} from "react";
import {useMap} from "react-map-gl/mapbox";
import {Box, Collapse} from "@mui/material";
import {Business, Storage} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import {InstitutionEntry, Metrics} from "@/app/types";
import {byteString} from "@/util";
import {useOSDFNetworkMap} from "@/components/OSDFNetworkMap/OSDFNetworkMapContext";

interface InstitutionListProps {
  institutions: InstitutionEntry[];
  totalMetrics: Metrics;
}

const InstitutionList = ({institutions}: InstitutionListProps) => {
  const {state: {activeSiteIndex}, dispatch} = useOSDFNetworkMap();

  const {current: map} = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEntry = institutions[activeSiteIndex];
    if (!activeEntry || !containerRef.current) return;
    const el = containerRef.current.querySelector(`#${CSS.escape(activeEntry.id)}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeSiteIndex]);

  return (
    <Box ref={containerRef} overflow="auto" p={2}>
      {institutions.map((institution, i) => {
        const active = i === activeSiteIndex;
        const caches = institution.servers.length;

        return (
          <Box
            key={institution.id}
            id={institution.id}
            display="flex"
            justifyContent="space-between"
            flexDirection={'column'}
            mb={2}
            overflow="hidden"
            onClick={() => {
              dispatch({ type: 'SET_ACTIVE_SITE', index: i, total: institutions.length });
              if (map) { map.flyTo({center: [institution.longitude, institution.latitude]}); }
            }}
            sx={{cursor: 'pointer', backgroundColor: active ? "rgba(0,0,0,0.08)" : "transparent", borderRadius: 1, p: 1}}
          >
            <Box display={'flex'} mr={1} my={"auto"}>
              <Business color={"primary"} fontSize={'small'} />
              <Typography sx={{ml:1}} variant={'subtitle2'}>
                {caches} {caches === 1 ? "Cache" : "Caches"}
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
              title={institution.name}
            >
              {institution.name}
            </Typography>
            <Box>
              <Grid container gap={2} justifyContent="flex-start">
                <Grid>
                  <Typography variant={"subtitle2"}>
                    Pulled:
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant={"subtitle2"}>
                    {byteString(institution.summary.bytes)}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant={"subtitle2"}>
                    {institution.summary.objects.toLocaleString()} Objects
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Collapse in={active} unmountOnExit>
              <Box mt={1} pl={1} sx={{borderLeft: '2px solid rgba(0,0,0,0.12)'}}>
                {institution.servers.map(server => (
                  <Box key={server.name} display="flex" alignItems="center" gap={1} py={0.25} overflow="hidden">
                    <Storage sx={{color: "#FF5733"}} fontSize={'small'} />
                    <Typography
                      variant={'body2'}
                      sx={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flexGrow: 1}}
                      title={server.name}
                    >
                      {server.name}
                    </Typography>
                    <Typography variant={'caption'} sx={{whiteSpace: 'nowrap'}} title={`${byteString(server.bytes)} transferred`}>
                      {server.objects.toLocaleString()} Objects
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </Box>
        )
      })}
    </Box>
  )
}

export default InstitutionList;
