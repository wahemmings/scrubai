
export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  last_used: string | null;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface ApiKeyRequest {
  name: string;
  expiresInDays?: number;
}

export interface ApiKeyResponse {
  key: string;
  prefix: string;
  expiresAt: string;
}
