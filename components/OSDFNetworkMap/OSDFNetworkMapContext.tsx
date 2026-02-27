"use client";

import React, { createContext, useContext, useReducer } from "react";



interface State {
  activeSiteIndex: number;
}

type Action =
  | { type: 'SET_ACTIVE_SITE'; index: number; total: number }
  | { type: 'GO_FORWARD'; total: number }
  | { type: 'GO_BACKWARD'; total: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ACTIVE_SITE':
      return { ...state, activeSiteIndex: (action.index + action.total) % action.total };
    case 'GO_FORWARD':
      return { ...state, activeSiteIndex: (state.activeSiteIndex + 1) % action.total };
    case 'GO_BACKWARD':
      return { ...state, activeSiteIndex: (state.activeSiteIndex - 1 + action.total) % action.total };
    default:
      return state;
  }
}

interface OSDFNetworkMapContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const OSDFNetworkMapContext = createContext<OSDFNetworkMapContextValue | undefined>(undefined);

interface OSDFNetworkMapProviderProps {
  children: React.ReactNode;
}

export const OSDFNetworkMapProvider = ({ children }: OSDFNetworkMapProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { activeSiteIndex: 0 });

  return (
    <OSDFNetworkMapContext.Provider value={{ state, dispatch }}>
      {children}
    </OSDFNetworkMapContext.Provider>
  );
};

export const useOSDFNetworkMap = (): OSDFNetworkMapContextValue => {
  const context = useContext(OSDFNetworkMapContext);
  if (!context) {
    throw new Error("useOSDFNetworkMap must be used within an OSDFNetworkMapProvider");
  }
  return context;
};
