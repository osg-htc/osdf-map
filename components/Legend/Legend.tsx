import {Box, Dialog, DialogContent, DialogTitle, IconButton, Link, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Close, InfoOutline, Storage, TripOrigin} from "@mui/icons-material";
import {useState} from "react";

const Legend = ({date}: {date: Date}) => {

  const [aboutOpen, setAboutOpen] = useState(false);

  const oneYearAgo = new Date(date);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return (
    <>
    <Paper
      elevation={1}
      sx={{
        position: "absolute",
        bottom: 48,
        left: 16,
        zIndex: 9999,
        p: 1
      }}
    >
      <Box display="flex" flexDirection="row" alignItems={'center'} mb={1}>
        <Box sx={{borderRadius: "50%", borderColor: "#65b853", border: '2px solid', backgroundColor: "#e4fddb", height:'1.65rem', width: '1.65rem'}}></Box>
        <Typography sx={{ml:1}} variant={'subtitle1'}>Institution</Typography>
      </Box>
      <Box display="flex" flexDirection="row" alignItems={'center'} mb={1}>
        <Box sx={{backgroundColor: "black", borderRadius: "50%", padding: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1001}}>
          <Storage color={"primary"} />
        </Box>
        <Typography sx={{ml:1}} variant={'subtitle1'}>Cache</Typography>
      </Box>
      <Box display="flex" flexDirection="row" alignItems={'center'} mb={1}>
        <Box sx={{backgroundColor: "black", borderRadius: "50%", padding: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1001}}>
          <TripOrigin color={"primary"}/>
        </Box>
        <Typography sx={{ml:1}} variant={'subtitle1'}>Origin</Typography>
      </Box>
      <hr/>
      <Box display="flex" flexDirection="column" alignItems={''}>
        <Typography sx={{}} variant={'subtitle1'}>{oneYearAgo.toLocaleDateString()} - {date.toLocaleDateString()}</Typography>
        <Link
          href={"#"}
          onClick={(e) => { e.preventDefault(); setAboutOpen(true); }}
          sx={{display: 'flex', alignItems: 'center', mt: 1, color: 'primary.dark' }}
        >
          <InfoOutline /><Box ml={1}>About The Data</Box>
        </Link>
      </Box>
    </Paper>

    <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        About The Data
        <IconButton onClick={() => setAboutOpen(false)} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" mb={2}>
          This map visualizes data transfer activity across the Open Science Data Federation (OSDF) network over the
          past year ({oneYearAgo.toLocaleDateString()} – {date.toLocaleDateString()}). Each data point reflects
          aggregated bytes transferred from OSDF <Link href={"https://pelicanplatform.org"}>Pelican</Link> servers (Caches and Origins) to <Link href={"https://osg-htc.org/ospool"}>OSPool</Link> institutions.
        </Typography>
        <Typography variant="body1" mb={2}>
          Metrics represent activity observed within the displayed time window and may not reflect
          real-time server availability or current network topology.
        </Typography>
        <Typography variant="body1">
          For more information about OSDF and the Pelican Platform, visit{" "}
          <Link href="https://osg-htc.org/services/osdf.html" target="_blank" rel="noopener">osg-htc.org</Link>.
        </Typography>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default Legend;
