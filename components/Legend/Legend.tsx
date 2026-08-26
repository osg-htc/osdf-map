import {Box, Dialog, DialogContent, DialogTitle, IconButton, Link, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Business, Close, InfoOutline, Storage, TripOrigin} from "@mui/icons-material";
import {ReactNode, useState} from "react";

export type LegendVariant = "servers" | "sites";

interface LegendProps {
  date: Date;
  /** "servers" fans out from a Pelican server; "sites" fans out from a compute site. */
  variant?: LegendVariant;
}

const Badge = ({children}: {children: ReactNode}) => (
  <Box sx={{backgroundColor: "black", borderRadius: "50%", padding: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1001}}>
    {children}
  </Box>
);

const Swatch = ({fill, stroke}: {fill: string, stroke: string}) => (
  <Box sx={{borderRadius: "50%", borderColor: stroke, border: '2px solid', backgroundColor: fill, height:'1.65rem', width: '1.65rem'}} />
);

const legendItems: Record<LegendVariant, {icon: ReactNode, label: string}[]> = {
  servers: [
    {icon: <Badge><Storage color={"primary"} /></Badge>, label: "Cache"},
    {icon: <Badge><TripOrigin color={"primary"} /></Badge>, label: "Origin"},
    {icon: <Swatch fill={"#e4fddb"} stroke={"#65b853"} />, label: "Data Transferred to Institution"},
  ],
  sites: [
    {icon: <Badge><Business sx={{color: "#65b853"}} /></Badge>, label: "Compute Site"},
    {icon: <Storage sx={{color: "#FF5733"}} />, label: "Cache"},
    {icon: <Swatch fill={"#ffe3da"} stroke={"#FF5733"} />, label: "Data Pulled from Cache"},
  ],
};

const Legend = ({date, variant = "servers"}: LegendProps) => {

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
      {legendItems[variant].map(({icon, label}) => (
        <Box key={label} display="flex" flexDirection="row" alignItems={'center'} mb={1}>
          <Box display="flex" width={"1.65rem"} justifyContent={"center"}>{icon}</Box>
          <Typography sx={{ml:1}} variant={'subtitle1'}>{label}</Typography>
        </Box>
      ))}
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
        {variant === "sites" &&
          <Typography variant="body1" mb={2}>
            This is the reverse view: it starts from a compute site and fans out to every cache that site pulled
            data from. Origins are not shown here. The <Link href={"./"}>server view</Link> shows the same transfers
            in the other direction.
          </Typography>
        }
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
