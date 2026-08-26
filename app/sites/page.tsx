import * as fs from 'node:fs/promises';
import {Box} from "@mui/material";

import {EndpointSiteMap, InstitutionEntry, Metrics, Server} from "@/app/types";
import SiteNetworkMap from "@/components/SiteNetworkMap";

/**
 * The inverse of the landing page: instead of walking out from a Pelican server
 * to the institutions it served, this walks out from a compute site to every
 * cache and origin it pulled data from.
 */
export default async function Sites() {

  const siteMapFile = await fs.readFile("./public/data/endpoint_site_map.json", "utf-8")
  const siteMap = JSON.parse(siteMapFile) as EndpointSiteMap;

  const institutionMap = new Map<string, InstitutionEntry>();

  siteMap
    .filter(e => e.server) // Filter out entries without server information
    .forEach(entry => {
      const server = entry.server as Server;
      entry.institutions.forEach(({sites, count, bytes, objects, ...metadata}) => {
        const institution = institutionMap.get(metadata.id) ?? {
          ...metadata,
          sites: [],
          servers: [],
          summary: {count: 0, bytes: 0, objects: 0},
        };

        institution.servers.push({...server, endpoints: entry.endpoints, count, bytes, objects});
        institution.sites = [...new Set([...institution.sites, ...sites])].sort();
        institution.summary = {
          count: institution.summary.count + count,
          bytes: institution.summary.bytes + bytes,
          objects: institution.summary.objects + objects,
        };

        institutionMap.set(metadata.id, institution);
      });
    });

  const institutions = [...institutionMap.values()]
    .map(i => ({...i, servers: [...i.servers].sort((a, b) => b.bytes - a.bytes)}))
    .sort((a, b) => b.summary.bytes - a.summary.bytes);

  const totalMetrics = institutions.reduce((acc, i) => {
    acc.count += i.summary.count;
    acc.bytes += i.summary.bytes;
    acc.objects += i.summary.objects;
    return acc;
  }, {count: 0, bytes: 0, objects: 0} as Metrics);

  const generatedDate = new Date();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <SiteNetworkMap institutions={institutions} totalMetrics={totalMetrics} date={generatedDate} />
    </Box>
  );
}
