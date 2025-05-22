
/**
 * Custom type definitions for security features
 */

// Global garbage collection interface
interface Window {
  gc?: () => void;
}

// GDPR/CCPA Data Subject Access Request types
interface DataSubjectRequest {
  id: string;
  user_id: string;
  request_type: 'access' | 'delete' | 'modify';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  created_at: string;
  completed_at: string | null;
  data?: Record<string, any>;
}

// Security event log types
interface SecurityEvent {
  id: string;
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, any>;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

// API key types
interface ApiKeyRequest {
  name: string;
  expiresInDays?: number;
}

interface ApiKeyResponse {
  key: string;
  prefix: string;
  expiresAt: string;
}
