import * as fs from 'node:fs/promises';
import {Box} from "@mui/material";

import {EndpointSiteMap, InstitutionEntry, Metrics, Server} from "@/app/types";
import SiteNetworkMap from "@/components/SiteNetworkMap";
import {spreadCoLocated} from "@/util";

/**
 * The inverse of the landing page: instead of walking out from a Pelican cache
 * to the institutions it served, this walks out from a compute site to every
 * cache it pulled data from.
 */
export default async function Sites() {

  const siteMapFile = await fs.readFile("./public/data/endpoint_site_map.json", "utf-8")
  const siteMap = JSON.parse(siteMapFile) as EndpointSiteMap;

  // Origins are excluded for now — this view is about the caches a site pulled from
  const cacheEntries = siteMap.filter(e => e.server?.type === "Cache");

  // Several servers share an exact coordinate, so fan each stack out once up
  // front. Doing it globally rather than per institution keeps a given server
  // pinned to the same spot no matter which site is selected.
  const servers = cacheEntries.map(e => e.server as Server);
  const displayCoordinate = new Map(
    spreadCoLocated(servers).map(s => [s.name, {latitude: s.latitude, longitude: s.longitude}])
  );

  const institutionMap = new Map<string, InstitutionEntry>();

  cacheEntries
    .forEach(entry => {
      const server = entry.server as Server;
      entry.institutions.forEach(({sites, count, bytes, objects, ...metadata}) => {
        const institution = institutionMap.get(metadata.id) ?? {
          ...metadata,
          sites: [],
          servers: [],
          summary: {count: 0, bytes: 0, objects: 0},
        };

        institution.servers.push({
          ...server,
          ...displayCoordinate.get(server.name),
          endpoints: entry.endpoints,
          count, bytes, objects,
        });
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
    // Ordered by objects to match what the circle sizes on the map encode
    .map(i => ({...i, servers: [...i.servers].sort((a, b) => b.objects - a.objects)}))
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
