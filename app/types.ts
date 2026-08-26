export interface Marker {
  latitude: number;
  longitude: number;
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
  endpoints: string[];
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

/**
 * A point on the map that carries transfer metrics and can be labelled.
 * Both `Institution` and `ServerLink` satisfy this shape, which lets the
 * metric layers/markers be shared between the forward and reverse views.
 */
export type MetricPoint = Marker & Metrics & { name: string };

/** A server an institution pulled data from, with the metrics for that pairing. */
export type ServerLink = Server & Metrics & { endpoints: string[] };

/** The inverse of `EndpointEntry`: one institution and every server it pulled from. */
export interface InstitutionEntry extends InstitutionMetadata {
  sites: string[];
  servers: ServerLink[];
  summary: Metrics;
}
