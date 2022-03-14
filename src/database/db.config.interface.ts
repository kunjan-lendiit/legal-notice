export interface DatabaseConfigAttributes {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number | string;
  dialect?: string;
  urlDatabase?: string;
  logging?: boolean;
}

export interface DatabaseConfig {
  user: DatabaseConfigAttributes;
  contact: DatabaseConfigAttributes;
  netbanking: DatabaseConfigAttributes;
  indbank: DatabaseConfigAttributes;

}
