"use client";

import {useEffect} from "react";
import {useMap} from 'react-map-gl/mapbox';

import {InstitutionEntry} from "@/app/types";
import InstitutionMarker from "@/components/InstitutionMarker";
import {useOSDFNetworkMap} from "@/components/OSDFNetworkMap/OSDFNetworkMapContext";

interface InstitutionLayerProps {
  institutions: InstitutionEntry[];
}

const InstitutionLayer = ({institutions}: InstitutionLayerProps) => {

  const {state: {activeSiteIndex}, dispatch} = useOSDFNetworkMap();

  const activeInstitution = institutions[activeSiteIndex];
  const {current: map} = useMap();

  useEffect(() => {
    if (map && activeInstitution) {
      map.flyTo({center: [activeInstitution.longitude, activeInstitution.latitude]});
    }
  }, [activeInstitution?.longitude, activeInstitution?.latitude]);

  // Render the active institution last so its connections draw over the rest
  const renderOrder = [...institutions.filter((s, i) => i != activeSiteIndex), activeInstitution];

  return (
    <>
      {renderOrder.map((institution) => (
        <InstitutionMarker
          key={institution.id}
          institution={institution}
          active={institution.id === activeInstitution?.id}
          showConnections={institution.id === activeInstitution?.id}
          onClick={id => {
            const index = institutions.findIndex(i => i.id === id);
            if (index !== -1) {
              dispatch({type: 'SET_ACTIVE_SITE', index, total: institutions.length});
            }
          }}
        />
      ))}
    </>
  )
}

export default InstitutionLayer;
