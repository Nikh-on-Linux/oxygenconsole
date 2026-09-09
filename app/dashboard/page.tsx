"use client"
import { useTopPanelStore } from "@/lib/store/TopPanelStore"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CloudUploadIcon } from "lucide-react"
import Panel from "@/components/panel"
import FolderBox from "@/components/folderbox"
import FileBox from "@/components/filebox"
import { useUserInformationStore } from "@/lib/store/userStore"
import DirectoryWindow from "@/components/directorywindow"


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

  const { dashboardItems } = useUserInformationStore();

  return (
    <section className="px-4 w-full" >
      <Panel title={"Recent Folders"} className={"w-full"}>
        <DirectoryWindow>
          {
            dashboardItems?.folders?.map((item, key) => {
              return (
                <FolderBox key={key} folderid={item.folder_id} foldername={item.folder_name} />
              )
            })
          }
        </DirectoryWindow>
      </Panel>
      <Panel title={"Recent Files"} className={"w-full"} >
        <DirectoryWindow>
          {
            dashboardItems?.files?.map((item, key) => {
              return (
                <FileBox key={key} filename={item.filename} fileid={item.file_id} />
              )
            })
          }
        </DirectoryWindow>
      </Panel>
    </section>
  )
}
