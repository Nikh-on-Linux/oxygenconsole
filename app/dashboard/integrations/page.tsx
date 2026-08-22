"use client"
import AgentList from '@/components/agentlist'
import React, { useEffect, useState } from 'react'
import { useTopPanelStore } from '@/lib/store/TopPanelStore'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Switch } from '@/components/ui/switch'

const data = [
  {
    name: "Agent1",
    isActive: true,
    target: "root",
    scopes: "rwx"
  },
  {
    name: "Agent1",
    isActive: false,
    target: "photos",
    scopes: "rw"
  },
  {
    name: "Agent1",
    isActive: true,
    target: "something weird",
    scopes: "r"
  },
  {
    name: "Agent1",
    isActive: true,
    target: "root",
    scopes: "rw"
  },
  {
    name: "Agent1",
    isActive: false,
    target: "root",
    scopes: "w"
  },
]

function IntegrationsPage() {
  const [isOpen, setOpen] = useState(false);
  const [activeScope, setActiveScope] = useState("r")
  useEffect(() => {
    useTopPanelStore.getState().setAction(
      <Button onClick={() => setOpen(true)} variant={"default"} >
        <PlusIcon />
        <span>Create Agent</span>
      </Button>
    )

    useTopPanelStore.getState().setPageTitle("Integrations")

    return () => useTopPanelStore.getState().reset();
  }, [])

  return (
    <section className='w-full h-full overflow-x-hidden overflow-y-auto px-4 py-2' >
      <span className='text-xl font-semibold block'>Configure your Agents</span>
      <AgentList data={data} className={"mt-12"} />
      <Sheet open={isOpen} onOpenChange={setOpen} >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Agent Configuration</SheetTitle>
            <SheetDescription>Control how your agent behaves with oxygen with this panel.</SheetDescription>
          </SheetHeader>
          <FieldSet className='px-4' >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Agent Name</FieldLabel>
                <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Target Folder</FieldLabel>
                <Input id="username" autoComplete="off" placeholder='Paste folder path' />
              </Field>
              <Field orientation="vertical">
                <FieldLabel htmlFor="newsletter">Scopes</FieldLabel>
                <FieldDescription>Scopes provides the appropriate access rights required for the agent to operate on the target folder.</FieldDescription>
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
                    >
                      {scope.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Field>
              <Field orientation={"horizontal"} className=''>
                <span className='font-sans font-medium' >Enable Agent</span>
                <Switch />
              </Field>
            </FieldGroup>
          </FieldSet>
          <SheetFooter>
            <Button>Create Agent</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default IntegrationsPage