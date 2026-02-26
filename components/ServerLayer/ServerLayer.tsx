"use client";

import PelicanServerMarker from "@/components/PelicanServerMarker/PelicanServerMarker";
import {useEffect} from "react";
import {EnhancedEndpointEntry, Metrics, Server} from "@/app/types";
import SiteServerOverview from "@/components/SiteServerOverview";
import {useOSDFNetworkMap} from "@/components/OSDFNetworkMap/OSDFNetworkMapContext";
import {useMap} from 'react-map-gl/mapbox';


interface ServerSiteLayerProps {
  siteMap: EnhancedEndpointEntry[];
  totalMetrics: Metrics;
}

const ServerSiteLayer = ({siteMap, totalMetrics}: ServerSiteLayerProps) => {

  const {state: {activeSiteIndex}, dispatch} = useOSDFNetworkMap();

  const sitesWithServers = siteMap.filter(endpointEntry => endpointEntry.server);
  const activeSite = sitesWithServers[activeSiteIndex];
  const {current: map} = useMap();

  useEffect(() => {
    if(map && activeSite.server){
      map.flyTo({center: [activeSite.server.longitude, activeSite.server.latitude]});
    }
  }, [activeSite?.server?.longitude, activeSite?.server?.latitude]);

  const siteRenderOrder = [...sitesWithServers.filter((s, i) => i != activeSiteIndex), activeSite];

  return (
    <>
      {siteRenderOrder.map((endpointEntry, i) => {
        const s = endpointEntry.server as unknown as Server;
        return <PelicanServerMarker
          key={s.name}
          name={s.name}
          active={s.name === activeSite?.server?.name}
          type={s.type}
          showInstitutions={true}
          showConnections={s.name === activeSite?.server?.name}
          institutions={endpointEntry.institutions}
          latitude={s.latitude}
          longitude={s.longitude}
          totalMetrics={totalMetrics}
          onClick={e => {
            const index = sitesWithServers.findIndex(site => site.server?.name === e);
            if (index !== -1) {
              dispatch({ type: 'SET_ACTIVE_SITE', index, total: sitesWithServers.length });
            }
          }}
        />
      })}
    </>
  )
}



export default ServerSiteLayer;
