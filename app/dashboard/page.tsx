"use client"
import { useTopPanelStore } from "@/lib/store/TopPanelStore"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CloudUploadIcon } from "lucide-react"
import Panel from "@/components/panel"
import FolderBox from "@/components/folderbox"
import FileBox from "@/components/filebox"


export default function Page() {
  useEffect(() => {
    useTopPanelStore.getState().setAction(
      <Button variant={"default"} render={<Link href={"/dashboard/upload"} />} >
        <CloudUploadIcon />
        <span>New File</span>
      </Button>
    )

    useTopPanelStore.getState().setPageTitle("Home");

    return () => useTopPanelStore.getState().reset()
  }, [])

  const data = [
    {
      foldername: "Sample folder",
      folderid: "1413524"
    },
    {
      foldername: "Folder sample",
      folderid: "1424"
    },
    {
      foldername: "Another folder sample",
      folderid: "1413245524"
    }
  ]

  return (
    <section className="px-4" >
      <Panel title={"Recent Folders"} className={"mt-4"}>
        {
          data.map((item,key)=>{
            return(
              <FolderBox key={key} folderid={item.folderid} foldername={item.foldername} />
            )
          })
        }
      </Panel>
      <Panel title={"Recent Files"} className={"mt-10"} >
        {
          data.map((item,key)=>{
            return(
              <FileBox key={key} filename={item.foldername} fileid={item.folderid} />
            )
          })
        }
        </Panel>
    </section>
  )
}
