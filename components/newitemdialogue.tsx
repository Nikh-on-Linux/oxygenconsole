"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import UploadPage from "@/app/dashboard/upload/page";

import {
  Input,
} from "./ui/input";

import {
  Button,
} from "./ui/button";

import {
  useTopPanelStore,
} from "@/lib/store/TopPanelStore";

import {
  useFileStore,
} from "@/lib/store/FolderFileStore";

import {
  Loader2Icon,
} from "lucide-react";


interface ResponseInterface {
  message: string;
  suc: boolean;
}


function NewDialogue() {

  const params =
    useSearchParams();

  const router =
    useRouter();


  const [
    fileDialogue,
    setFileDialogue,
  ] = useState(false);


  const [
    folderDialogue,
    setFolderDialogue,
  ] = useState(false);


  const [
    foldername,
    setFoldername,
  ] = useState("");


  const currentPath =
    useTopPanelStore(
      (state) =>
        state.currentPath
    );


  const response =
    useFileStore(
      (state) =>
        state.response
    );


  const isLoading =
    useFileStore(
      (state) =>
        state.isLoading
    );


  /*
   * Keep dialog state synchronized with
   * ?ni=...
   */
  useEffect(() => {

    const type =
      params.get("ni");


    setFileDialogue(
      type === "file"
    );


    setFolderDialogue(
      type === "folder"
    );

  }, [params]);


  /*
   * Remove ?ni from the current URL.
   */
  function closeDialogue() {

    const nextParams =
      new URLSearchParams(
        params.toString()
      );


    nextParams.delete("ni");


    const query =
      nextParams.toString();


    router.replace(
      query
        ? `${window.location.pathname}?${query}`
        : window.location.pathname
    );
  }


  function createFolder() {

    useFileStore
      .getState()
      .createFolder(
        currentPath,
        foldername
      );
  }


  useEffect(() => {

    if (response?.suc) {

      alert(
        response.message
      );


      setFolderDialogue(
        false
      );


      router.push(
        `/dashboard/myair${currentPath}/${foldername}`
      );
    }

  }, [
    response,
    router,
    currentPath,
    foldername,
  ]);


  return (
    <section>

      {/* File dialogue */}

      <Dialog
        open={fileDialogue}
        onOpenChange={(open) => {

          setFileDialogue(open);

          if (!open) {
            closeDialogue();
          }

        }}
      >

        <DialogContent
          className="sm:max-w-md"
        >

          <DialogHeader>

            <DialogTitle>
              Upload File
            </DialogTitle>

            <DialogDescription>
              The file will be uploaded in
              the current directory.
            </DialogDescription>

          </DialogHeader>


          <UploadPage />

        </DialogContent>

      </Dialog>


      {/* Folder dialogue */}

      <Dialog
        open={folderDialogue}
        onOpenChange={(open) => {

          setFolderDialogue(open);

          if (!open) {
            closeDialogue();
          }

        }}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>
              Create new Folder
            </DialogTitle>

            <DialogDescription>
              The new folder will be created
              in current directory.
            </DialogDescription>

            <span className="mt-4">
              Folder name
            </span>

            <Input
              type="text"
              placeholder="e.g, Pictures"
              value={foldername}
              onChange={(event) =>
                setFoldername(
                  event.target.value
                )
              }
            />

          </DialogHeader>


          <DialogFooter>

            <DialogClose
              render={
                <Button
                  type="button"
                  variant="secondary"
                >
                  Close
                </Button>
              }
            />


            <Button
              disabled={isLoading}
              onClick={
                createFolder
              }
              variant="default"
            >

              {isLoading ? (
                <>
                  <Loader2Icon />

                  <span>
                    Creating...
                  </span>
                </>
              ) : (
                <span>
                  Create
                </span>
              )}

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </section>
  );
}

export default NewDialogue;