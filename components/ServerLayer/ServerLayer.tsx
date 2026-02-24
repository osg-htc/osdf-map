"use client";

import PelicanServerMarker from "@/components/PelicanServerMarker/PelicanServerMarker";
import {useEffect, useState} from "react";
import {EndpointEntry, EndpointSiteMap, EnhancedEndpointEntry, Metrics, Server} from "@/app/types";
import SiteServerOverview from "@/components/SiteServerOverview";
import {useMap} from 'react-map-gl/mapbox';


interface ServerSiteLayerProps {
  siteMap: EnhancedEndpointEntry[];
  totalMetrics: Metrics;
}

const ServerSiteLayer = ({siteMap, totalMetrics}: ServerSiteLayerProps) => {

  const sitesWithServers = siteMap.filter(endpointEntry => endpointEntry.server);

  const [activeSiteIndex, _setActiveSiteIndex] = useState<number>(0);
  const [play, setPlay] = useState<boolean>(true);

  const activeSite = sitesWithServers[activeSiteIndex];
  const {current: map} = useMap();

  const setActiveSiteIndex = (index: number) => {
    const newIndex = (index + sitesWithServers.length) % sitesWithServers.length; // Ensure index wraps around
    _setActiveSiteIndex(newIndex);
    const newActiveSite = sitesWithServers[newIndex];
    const location = [newActiveSite.server?.longitude, newActiveSite.server?.latitude] as [number, number];
    if(map){
      map.flyTo({center: location});
    }
  }

  // Cycle through servers every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if(play){
        const newIndex = (activeSiteIndex + 1) % sitesWithServers.length;
        setActiveSiteIndex(newIndex);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [sitesWithServers.length, play, map, activeSiteIndex]);

  // On mount, fly to the first server
  useEffect(() => {
    if(map && activeSite.server){
      map.flyTo({center: [activeSite.server.longitude, activeSite.server.latitude]});
    }
  }, [map, activeSite.server]);


  return (
    <>
      {[activeSite].map((endpointEntry) => {
        const s = endpointEntry.server as unknown as Server;
        return <PelicanServerMarker
          key={s.name}
          name={s.name}
          type={s.type}
          showInstitutions={true}
          showConnections={activeSite == endpointEntry}
          institutions={endpointEntry.institutions}
          latitude={s.latitude}
          longitude={s.longitude}
          totalMetrics={totalMetrics}
        />
      })}
      <SiteServerOverview
        endpointEntry={activeSite}
        totalMetrics={totalMetrics}
        play={play}
        onPlay={() => setPlay((p) => !p)}
        onToggleForward={() => setActiveSiteIndex((activeSiteIndex + 1) % sitesWithServers.length)}
        onToggleReverse={() => setActiveSiteIndex((activeSiteIndex - 1 + sitesWithServers.length) % sitesWithServers.length)}
      />
    </>
  )
}

export default ServerSiteLayer;
