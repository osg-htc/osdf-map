"use client";

import Link from "next/link";
import {Paper, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {Business, Storage} from "@mui/icons-material";

/**
 * Switches between the server-centric map ("/") and its inverse, the
 * compute-site-centric map ("/sites").
 */
const ViewToggle = ({active}: {active: "servers" | "sites"}) => (
  <Paper
    elevation={1}
    sx={{
      position: "absolute",
      top: 16,
      left: 16,
      zIndex: 9999,
    }}
  >
    <ToggleButtonGroup value={active} exclusive size={"small"}>
      <ToggleButton value={"servers"} component={Link} href={"/"}>
        <Storage fontSize={"small"} sx={{mr: 1}} /> By Server
      </ToggleButton>
      <ToggleButton value={"sites"} component={Link} href={"/sites"}>
        <Business fontSize={"small"} sx={{mr: 1}} /> By Compute Site
      </ToggleButton>
    </ToggleButtonGroup>
  </Paper>
);

export default ViewToggle;
