"use client"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { useTopPanelStore } from "@/lib/store/TopPanelStore"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CloudUploadIcon } from "lucide-react"


export default function Page() {
  useEffect(() => {
    useTopPanelStore.getState().setAction(
      <Button variant={"default"} render={<Link href={"/dashboard/upload"} />} >
        <CloudUploadIcon />
        <span>New File</span>
      </Button>
    )

    return () => useTopPanelStore.getState().resetAction()
  },[])

  return (
    <div className="px-4" >Something worth working</div>
  )
}
