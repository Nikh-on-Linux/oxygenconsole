export interface WebhookConfig {
  target_url: string;
  enabled: boolean;
  event_type: string;
}

export interface Agent {
  agent_id?: string | number;
  _id?: string | number;
  id?: string | number;
  name: string;
  path?: string;
  target?: string;
  targetFolder?: string;
  scopes?: string;
  scope?: string;
  isActive?: boolean;
  active?: boolean;
  enabled?: boolean | null;
  target_url?: string | null;
  event_type?: string | null;
  webhook?: WebhookConfig;
  status?: string;
  apiKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAgentDTO {
  name: string;
  path?: string;
  target?: string;
  scopes?: string;
  isActive?: boolean;
  webhook: WebhookConfig;
}

export interface UpdateAgentDTO {
  name?: string;
  path?: string;
  target?: string;
  scopes?: string;
  isActive?: boolean;
  webhook: WebhookConfig;
}
