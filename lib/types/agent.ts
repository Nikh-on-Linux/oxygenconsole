export interface Agent {
  agent_id?: string;
  _id?: string;
  id?: string;
  name: string;
  path?: string;
  target?: string;
  targetFolder?: string;
  scopes?: string;
  scope?: string;
  isActive?: boolean;
  active?: boolean;
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
}

export interface UpdateAgentDTO {
  name?: string;
  path?: string;
  target?: string;
  scopes?: string;
  isActive?: boolean;
}
