import * as fs from 'node:fs/promises';
import { Box } from "@mui/material";

import {EndpointSiteMap, Metrics, Server} from "@/app/types";
import OSDFNetworkMap from "@/components/OSDFNetworkMap";
import {spreadCoLocated} from "@/util";


export default async function Home() {

  const siteMapFile = await fs.readFile("./public/data/endpoint_site_map.json", "utf-8")
  const siteMap = JSON.parse(siteMapFile) as EndpointSiteMap;
  // Several servers share an exact coordinate (five stack up at CHTC), which
  // would leave one marker hiding the rest — fan each stack onto a small ring.
  const displayCoordinate = new Map(
    spreadCoLocated(siteMap.filter(s => s.server).map(s => s.server as Server))
      .map(s => [s.name, {latitude: s.latitude, longitude: s.longitude}])
  );

  const enhancedSiteMap = siteMap.map(s => {
    return {
      ...s,
      server: s.server && {...s.server, ...displayCoordinate.get(s.server.name)},
      summary: {
        count: s.institutions.reduce((acc, site) => acc + site.count, 0),
        bytes: s.institutions.reduce((acc, site) => acc + site.bytes, 0),
        objects: s.institutions.reduce((acc, site) => acc + site.objects, 0),
      } as Metrics
    }
  })
    .sort((a, b) => b.total_bytes - a.total_bytes)
    .filter(s => s.server); // Filter out entries without server information
  const totalMetrics = enhancedSiteMap.reduce((acc, entry) => {
    acc.count += entry.summary.count;
    acc.bytes += entry.summary.bytes;
    acc.objects += entry.summary.objects;
    return acc;
  }, {count: 0, bytes: 0, objects: 0} as Metrics);

  const generatedDate = new Date();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <OSDFNetworkMap siteMap={enhancedSiteMap} totalMetrics={totalMetrics} date={generatedDate} />
    </Box>
  );
}
