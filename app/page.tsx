import * as fs from 'node:fs/promises';
import { Box } from "@mui/material";

import Map from "@/components/Map";
import {EndpointSiteMap, Metrics} from "@/app/types";
import ServerSiteLayer from "@/components/ServerLayer/ServerLayer";
import OSDFNetworkMap from "@/components/OSDFNetworkMap";


export default async function Home() {

  const siteMapFile = await fs.readFile("./public/data/endpoint_site_map.json", "utf-8")
  const siteMap = JSON.parse(siteMapFile) as EndpointSiteMap;
  const enhancedSiteMap = siteMap.map(s => {
    return {
      ...s,
      summary: {
        count: s.institutions.reduce((acc, site) => acc + site.count, 0),
        bytes: s.institutions.reduce((acc, site) => acc + site.bytes, 0),
        objects: s.institutions.reduce((acc, site) => acc + site.objects, 0),
      } as Metrics
    }
  })
    .sort((a, b) => a.server?.name.localeCompare(b.server?.name || "") || 0)
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
