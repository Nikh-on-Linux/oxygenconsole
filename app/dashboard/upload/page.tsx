"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";

import { PlusIcon } from "lucide-react";

import {
  useUploadStore,
} from "@/lib/store/uploadstore";

import {
  useTopPanelStore,
} from "@/lib/store/TopPanelStore";

import {
  usePathname,
  useRouter,
} from "next/navigation";


function UploadPage() {

  const inputFileRef =
    useRef<HTMLInputElement>(null);


  const router =
    useRouter();

  const pathname =
    usePathname();


  const currentPath =
    useTopPanelStore(
      (state) => state.currentPath
    );


  const selectFile =
    useUploadStore(
      (state) => state.selectFile
    );


  const startUploads =
    useUploadStore(
      (state) => state.startUploads
    );


  function handleInputChange(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {

    const selectedFiles =
      event.target.files;


    if (!selectedFiles) {
      return;
    }


    /*
     * Store the IDs of all newly
     * created upload records.
     */
    const uploadIds: string[] = [];


    /*
     * Create one independent upload
     * record for every selected file.
     */
    Array.from(selectedFiles).forEach(
      (selectedFile) => {

        const id =
          selectFile(
            selectedFile,
            currentPath
          );


        uploadIds.push(id);
      }
    );


    /*
     * Send all newly created uploads
     * to the client-side scheduler.
     *
     * The scheduler decides how many
     * can run simultaneously.
     */
    startUploads(uploadIds);


    /*
     * Remove ?ni=file.
     *
     * This closes the dialog because
     * NewDialogue derives its open state
     * from the query parameter.
     */
    const params =
      new URLSearchParams(
        window.location.search
      );


    params.delete("ni");


    const query =
      params.toString();


    router.replace(
      query
        ? `${pathname}?${query}`
        : pathname
    );


    /*
     * Reset input so the same file can
     * be selected again later.
     */
    if (
      inputFileRef.current
    ) {

      inputFileRef.current.value =
        "";
    }
  }


  return (
    <section
      className="
        w-full
        px-4
        flex
        items-center
        justify-center
        overflow-y-auto
      "
    >

      <div
        className="
          lg:max-w-[60rem]
          w-full
          aspect-video
          flex
          items-center
          justify-center
          border-border
          border-2
          border-dashed
          rounded-lg
        "
      >

        <input
          ref={inputFileRef}
          type="file"
          className="hidden"
          multiple
          onChange={
            handleInputChange
          }
        />


        <Button
          onClick={() =>
            inputFileRef.current?.click()
          }
        >

          <PlusIcon />

          <span>
            Browse File
          </span>

        </Button>

      </div>

    </section>
  );
}


export default UploadPage;