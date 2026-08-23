"use client";

import DirectoryWindow from "@/components/directorywindow";
import FileBox from "@/components/filebox";
import FolderBox from "@/components/folderbox";
import NewItemButton from "@/components/newItem";
import { useFileStore } from "@/lib/store/FolderFileStore";
import { useTopPanelStore } from "@/lib/store/TopPanelStore";
import { useEffect } from "react";
import { useParams } from "next/navigation";

function MyAir() {
  const items = useFileStore((state) => state.items);

  useEffect(() => {
    const topPanel = useTopPanelStore.getState();

    topPanel.setPageTitle("My Air");
    topPanel.setBreadCrumbs(true);
    topPanel.setAction(<NewItemButton />)

    useFileStore.getState().fetchFolder("/");

    return () => {
      useTopPanelStore.getState().reset();
    };
  }, []);

  return (
    <section className="h-full w-full overflow-x-hidden overflow-y-auto px-4 py-2">
      <DirectoryWindow>
        {items.folders.map((folder) => (
          <FolderBox
            key={folder.folder_id}
            foldername={folder.folder_name}
            folderid={folder.folder_id}
          />
        ))}

        {items.files.map((file) => (
          <FileBox
            key={file.file_id}
            fileid={file.file_id}
            filename={file.filename}
          />
        ))}
      </DirectoryWindow>
    </section>
  );
}

export default MyAir;