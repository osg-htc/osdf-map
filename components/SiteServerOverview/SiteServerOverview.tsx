import {EnhancedEndpointEntry, Metrics} from "@/app/types";
import {Box, IconButton, Paper} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {byteString} from "@/util";
import {FastForward, FastRewind, Pause, PlayArrow, Storage, TripOrigin} from "@mui/icons-material";


interface SiteServerOverviewProps {
  endpointEntry: EnhancedEndpointEntry;
  totalMetrics: Metrics;
  play: boolean;
  onPlay?: () => void;
  onToggleForward?: () => void;
  onToggleReverse?: () => void;
}




const SiteServerOverview = ({
  endpointEntry: e,
  totalMetrics,
  play,
  onPlay,
  onToggleForward,
  onToggleReverse
}: SiteServerOverviewProps) => {

  return (
    <Paper
      sx={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: 'background.paper',
        p: 1,
        borderRadius: 1,
        zIndex: 9999,
        width: {xs: '92%', md: '50%'}
      }}
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between" mb={2} overflow="hidden">
        <Box display="flex" flexDirection="row" alignItems="center" my={'auto'} flexGrow={1} minWidth={0}>
          <Box display={'flex'} mr={1} my={"auto"}>
            { e.server?.type == "Cache" ? <Storage color={"primary"} fontSize={'large'} /> : <TripOrigin color={"primary"} fontSize={'large'}/> }
          </Box>
          <Typography
            variant={"h5"}
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
        </Box>
        <Box display={"flex"} flexShrink={1}>
          <Box display="flex">
            <IconButton onClick={onToggleReverse}><FastRewind /></IconButton>
            <IconButton onClick={onPlay}>{play ? <PlayArrow /> : <Pause />}</IconButton>
            <IconButton onClick={onToggleForward}><FastForward /></IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container gap={2} justifyContent="center">
        <Grid>
          <Box>
            <Typography variant={"h6"}>
              {e.summary.count.toLocaleString()} Jobs
            </Typography>
            <Typography variant={'subtitle2'}>
              {totalMetrics.count.toLocaleString()} Total
            </Typography>
          </Box>
        </Grid>
        <Grid>
          <Box>
            <Typography variant={"h6"}>
              {byteString(e.summary.bytes)}
            </Typography>
            <Typography variant={'subtitle2'}>
              {byteString(totalMetrics.bytes)} Total
            </Typography>
          </Box>
        </Grid>
        <Grid>
          <Box>
            <Typography variant={"h6"}>
              {e.summary.objects.toLocaleString()} Objects
            </Typography>
            <Typography variant={'subtitle2'}>
              {totalMetrics.objects.toLocaleString()} Total
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default SiteServerOverview;
