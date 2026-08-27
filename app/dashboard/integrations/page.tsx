"use client"
import AgentList from '@/components/agentlist'
import React, { useEffect, useState, useMemo } from 'react'
import { useTopPanelStore } from '@/lib/store/TopPanelStore'
import { useAgentStore } from '@/lib/store/AgentStore'
import { Agent } from '@/lib/types/agent'
import { Button } from '@/components/ui/button'
import { PlusIcon, Loader2Icon, CopyIcon, CheckIcon, KeyIcon } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { ButtonGroup } from "@/components/ui/button-group"
import { Switch } from '@/components/ui/switch'

function IntegrationsPage() {
  const { agents, isLoading, fetchAgents, addAgent, editAgent, removeAgent } = useAgentStore();

  const [isOpen, setOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ApiKey Dialog state
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [isKeyDialogOpen, setKeyDialogOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [activeScope, setActiveScope] = useState("r");
  const [isActive, setIsActive] = useState(true);

  // Fetch agents on mount
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Set TopPanel action button & page title
  useEffect(() => {
    useTopPanelStore.getState().setAction(
      <Button onClick={handleOpenCreate} variant={"default"}>
        <PlusIcon />
        <span>Create Agent</span>
      </Button>
    );

    useTopPanelStore.getState().setPageTitle("Integrations");

    return () => useTopPanelStore.getState().reset();
  }, []);

  const handleOpenCreate = () => {
    setEditingAgent(null);
    setName("");
    setTarget("");
    setActiveScope("r");
    setIsActive(true);
    setOpen(true);
  };

  const handleOpenEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setName(agent.name || "");
    setTarget(agent.path || agent.target || agent.targetFolder || "");
    setActiveScope(agent.scopes || agent.scope || "r");
    setIsActive(
      agent.isActive !== undefined
        ? agent.isActive
        : agent.active !== undefined
        ? agent.active
        : true
    );
    setOpen(true);
  };

  // Determine if form has changes when in edit mode
  const isDirty = useMemo(() => {
    if (!editingAgent) return true; // Always true for creating new agent

    const initialName = editingAgent.name || "";
    const initialTarget = editingAgent.path || editingAgent.target || editingAgent.targetFolder || "";
    const initialScope = editingAgent.scopes || editingAgent.scope || "r";
    const initialIsActive =
      editingAgent.isActive !== undefined
        ? editingAgent.isActive
        : editingAgent.active !== undefined
        ? editingAgent.active
        : true;

    return (
      name !== initialName ||
      target !== initialTarget ||
      activeScope !== initialScope ||
      isActive !== initialIsActive
    );
  }, [editingAgent, name, target, activeScope, isActive]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Agent name is required");
      return;
    }

    // Path validation: target folder must start with "/"
    if (!target.startsWith("/")) {
      toast.error("Invalid path name: Target folder must start with a leading '/'");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAgent) {
        // Fallback to agent.agent_id, agent._id, agent.id, or find matching agent from list
        const agentId = 
          editingAgent.agent_id || 
          editingAgent._id || 
          editingAgent.id || 
          (editingAgent.name ? agents.find(a => a.name === editingAgent.name)?.agent_id || agents.find(a => a.name === editingAgent.name)?._id || agents.find(a => a.name === editingAgent.name)?.id : undefined);

        if (agentId) {
          const success = await editAgent(String(agentId), {
            name,
            path: target,
            target,
            scopes: activeScope,
            isActive,
          });
          if (success) {
            toast.success("Agent updated successfully");
            setOpen(false);
          } else {
            toast.error("Failed to update agent");
          }
        } else {
          toast.error("Agent ID missing. Cannot update agent.");
        }
      } else {
        const res = await addAgent({
          name,
          path: target,
          target,
          scopes: activeScope,
          isActive,
        });
        if (res.success) {
          toast.success("Agent created successfully");
          setOpen(false);
          if (res.apiKey) {
            setCreatedApiKey(res.apiKey);
            setHasCopied(false);
            setKeyDialogOpen(true);
          }
        } else {
          toast.error("Failed to create agent");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (agent: Agent) => {
    const agentId = agent.agent_id || agent._id || agent.id;
    if (agentId) {
      const success = await removeAgent(String(agentId));
      if (success) {
        toast.success("Agent deleted successfully");
      } else {
        toast.error("Failed to delete agent");
      }
    }
  };

  const handleCopyKey = () => {
    if (createdApiKey) {
      navigator.clipboard.writeText(createdApiKey);
      setHasCopied(true);
      toast.success("API key copied to clipboard!");
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <section className='w-full h-full overflow-x-hidden overflow-y-auto px-4 py-2'>
      <span className='text-xl font-semibold block'>Configure your Agents</span>
      
      <AgentList 
        data={agents} 
        className={"mt-12"} 
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Sheet for Create / Edit Agent */}
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingAgent ? "Edit Agent Configuration" : "Create Agent Configuration"}
            </SheetTitle>
            <SheetDescription>
              Control how your agent behaves with oxygen with this panel.
            </SheetDescription>
          </SheetHeader>
          
          <FieldSet className='px-4'>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Agent Name</FieldLabel>
                <Input 
                  id="name" 
                  autoComplete="off" 
                  placeholder="Evil Rabbit" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="target">Target Folder</FieldLabel>
                <Input 
                  id="target" 
                  autoComplete="off" 
                  placeholder='Paste folder path (e.g. /root)' 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  disabled={isSubmitting}
                />
              </Field>
              
              <Field orientation="vertical">
                <FieldLabel>Scopes</FieldLabel>
                <FieldDescription>
                  Scopes provides the appropriate access rights required for the agent to operate on the target folder.
                </FieldDescription>
                <ButtonGroup role="radiogroup" aria-label="Agent scopes">
                  {[
                    { label: "R", value: "r" },
                    { label: "W", value: "w" },
                    { label: "R & W", value: "rw" },
                    { label: "RW & X", value: "rwx" },
                  ].map((scope) => (
                    <Button
                      key={scope.value}
                      role="radio"
                      aria-checked={activeScope === scope.value}
                      variant={activeScope === scope.value ? "default" : "secondary"}
                      onClick={() => setActiveScope(scope.value)}
                      disabled={isSubmitting}
                    >
                      {scope.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Field>

              <Field orientation={"horizontal"} className=''>
                <span className='font-sans font-medium'>Enable Agent</span>
                <Switch 
                  checked={isActive} 
                  onCheckedChange={setIsActive} 
                  disabled={isSubmitting}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <SheetFooter className="mt-6">
            {(!editingAgent || isDirty) && (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    <span>{editingAgent ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <span>{editingAgent ? "Save Changes" : "Create Agent"}</span>
                )}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* One-time API Key Modal Dialog */}
      <Dialog open={isKeyDialogOpen} onOpenChange={setKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyIcon className="h-5 w-5 text-amber-500" />
              <span>Save Your Agent API Key</span>
            </DialogTitle>
            <DialogDescription>
              Please copy your API key now. For security reasons, <strong>this key will not be shown again</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 my-2">
            <Input 
              value={createdApiKey || ""} 
              readOnly 
              className="font-mono text-xs select-all pr-10" 
            />
            <Button size="icon" variant="outline" onClick={handleCopyKey}>
              {hasCopied ? (
                <CheckIcon className="h-4 w-4 text-emerald-500" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button variant="default" onClick={() => setKeyDialogOpen(false)}>
              I've copied my API key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default IntegrationsPage;