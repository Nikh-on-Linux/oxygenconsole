"use client";

import DirectoryWindow from "@/components/directorywindow";
import FolderBox from "@/components/folderbox";
import NewItemButton from "@/components/newItem";
import NewDialogue from "@/components/newitemdialogue";
import { useFileStore } from "@/lib/store/FolderFileStore";
import { useTopPanelStore } from "@/lib/store/TopPanelStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

function calculateBackPath(path: string[]): string {
  const parentPath = path.slice(0, -1);

  if (parentPath.length === 0) {
    return "/dashboard/myair";
  }

  return `/dashboard/myair/${parentPath.join("/")}`;
}

function DirectoryPage() {
  const { path } = useParams<{ path?: string[] }>();

  const currentPath = path ?? [];
  const pathString = currentPath.join("/");

  const items = useFileStore((state) => state.items);

  useEffect(() => {
    const topPanel = useTopPanelStore.getState();

    const currentFolderName =
      currentPath.at(-1) ?? "My Air";

    topPanel.setPageTitle(currentFolderName);
    topPanel.setBreadCrumbs(true);
    topPanel.setIsNested(currentPath.length > 0);
    topPanel.setAction(<NewItemButton />)

    if (currentPath.length > 0) {
      topPanel.setBackPath(
        calculateBackPath(currentPath)
      );
    }

    useFileStore
      .getState()
      .fetchFolder(pathString || "/");

    return () => {
      topPanel.reset();
    };
  }, [pathString]);

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
      </DirectoryWindow>
    </section>
  );
}

export default DirectoryPage;