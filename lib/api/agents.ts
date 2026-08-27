import { apiClient } from './client';
import { Agent, CreateAgentDTO, UpdateAgentDTO } from '../types/agent';

export async function getUserAgents(): Promise<Agent[]> {
  const res = await apiClient.get('/user/agents');
  return res.data?.agents || res.data?.data || res.data || [];
}

export async function createAgent(data: CreateAgentDTO) {
  const res = await apiClient.post('/auth/register/agent', data);
  return res.data;
}

export async function updateAgent(id: string, data: UpdateAgentDTO) {
  const res = await apiClient.patch(`/user/agent/${id}`, data);
  return res.data;
}

export async function deleteAgent(id: string) {
  const res = await apiClient.delete(`/user/agent/${id}`);
  return res.data;
}
