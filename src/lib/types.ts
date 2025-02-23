export interface Field {
  name: string;
  type: string;
}

export interface ApiConfig {
  endpoint: string;
  fields: Field[];
  id: string;
} 