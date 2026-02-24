export interface Marker {
  latitude: number;
  longitude: number;
}

export interface ExecutionPointMarkerProps extends Marker {

}

export type Institution = {
  sites: string[]
} & InstitutionMetadata & Metrics;


export interface InstitutionMetadata {
  name: string;
  id: string;
  ror_id?: string | null;
  unitid?: string;
  longitude: number;
  latitude: number;
  state?: string;
  ipeds_metadata?: IPEDSMetadata;
  carnegie_metadata?: CarnegieMetadata;
}

type IPEDSMetadata = {
  website_address: string;
  historically_black_college_or_university: boolean;
  tribal_college_or_university: boolean;
  program_length: string;
  control: string;
  state: string;
  institution_size: string;
};

type CarnegieMetadata = {
  classification2021: string;
  classification2025: string;
};

export type Server = {
  name: string;
  type: "Cache" | "Origin";
  latitude: number;
  longitude: number;
  namespaces: string[];
  health_status: string;
  server_status: string;
  version: string;
  url: string;
}

export type EndpointEntry = {
  endpoint: string;
  total_transfers: number;
  total_bytes: number;
  total_objects: number;
  institutions: Institution[];
  server?: Server;
};

export interface EnhancedEndpointEntry extends EndpointEntry {
  summary: Metrics
}

export interface Metrics {
  count: number;  // doc_count which is a proxy for Job Count
  bytes: number;
  objects: number;
}

export type EndpointSiteMap = EndpointEntry[];
