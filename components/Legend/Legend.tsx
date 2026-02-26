import {Box, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Storage, TripOrigin} from "@mui/icons-material";

const Legend = () => (
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
  </Paper>
)

export default Legend;
