import { create } from 'zustand';
import { Agent, CreateAgentDTO, UpdateAgentDTO } from '@/lib/types/agent';
import { getUserAgents, createAgent, updateAgent, deleteAgent } from '@/lib/api/agents';

interface AgentState {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAgents: () => Promise<void>;
  addAgent: (data: CreateAgentDTO) => Promise<{ success: boolean; agent?: Agent; apiKey?: string }>;
  editAgent: (id: string, data: UpdateAgentDTO) => Promise<boolean>;
  removeAgent: (id: string) => Promise<boolean>;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  isLoading: false,
  error: null,

  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const agents = await getUserAgents();
      set({ agents, isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch agents',
        isLoading: false,
      });
    }
  },

  addAgent: async (data: CreateAgentDTO) => {
    set({ isLoading: true, error: null });
    try {
      const res = await createAgent(data);
      await get().fetchAgents();
      return {
        success: true,
        agent: res?.agent || res?.data,
        apiKey: res?.apiKey || res?.key || res?.agent?.apiKey,
      };
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to create agent',
        isLoading: false,
      });
      return { success: false };
    }
  },

  editAgent: async (id: string, data: UpdateAgentDTO) => {
    set({ isLoading: true, error: null });
    try {
      await updateAgent(id, data);
      await get().fetchAgents();
      return true;
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to update agent',
        isLoading: false,
      });
      return false;
    }
  },

  removeAgent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteAgent(id);
      await get().fetchAgents();
      return true;
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to delete agent',
        isLoading: false,
      });
      return false;
    }
  },
}));
