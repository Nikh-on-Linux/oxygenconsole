"use client";

import { SidebarTrigger } from "./ui/sidebar";
import PathNavigation from "./path";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTopPanelStore } from "@/lib/store/TopPanelStore";
import { useNavigationStore } from "@/lib/store/mediaStore";

function StatusBar() {
  const action = useTopPanelStore((state) => state.action);
  const pageTitle = useTopPanelStore((state) => state.pagetitle);
  const showBreadCrumbs = useTopPanelStore(
    (state) => state.showBreadCrumbs
  );
  const isNested = useTopPanelStore(
    (state) => state.isNested
  );
  const backPath = useNavigationStore(
    (state) => state.backPath
  );

  const router = useRouter();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />

          {isNested && backPath && (
            <Button
              onClick={() => router.push(`${backPath}`)}
              size="icon-lg"
              variant="ghost"
              className="m-1"
            >
              <ArrowLeft />
            </Button>
          )}

          <span className="font-semibold">
            {pageTitle}
          </span>
        </div>

        {showBreadCrumbs && <PathNavigation />}
      </div>

      <div>{action}</div>
    </header>
  );
}

export default StatusBar;