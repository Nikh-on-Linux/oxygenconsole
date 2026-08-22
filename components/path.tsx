"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";

const FRONTEND_ROOT = "/dashboard/myair";

function formatName(value: string): string {
    return decodeURIComponent(value)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function PathNavigation() {
    const router = useRouter();

    const { path } = useParams<{
        path?: string[];
    }>();

    const directoryPath = path ?? [];

    const [isEditing, setIsEditing] = useState(false);
    const [inputPath, setInputPath] = useState("");

    /*
     * Convert the directory path into the actual frontend route.
     *
     * directoryPath:
     *
     * []                    -> /dashboard/myair
     * ["workspace"]         -> /dashboard/myair/workspace
     * ["workspace", "src"]  -> /dashboard/myair/workspace/src
     */
    function getRouteFromDirectoryPath(
        directoryPath: string[]
    ): string {
        if (directoryPath.length === 0) {
            return FRONTEND_ROOT;
        }

        return `${FRONTEND_ROOT}/${directoryPath.join("/")}`;
    }

    /*
     * Start editing.
     *
     * The user sees "/" as the directory root,
     * NOT "/dashboard/myair".
     */
    function startEditing() {
        const visiblePath =
            directoryPath.length === 0
                ? "/"
                : `/${directoryPath.join("/")}`;

        setInputPath(visiblePath);
        setIsEditing(true);
    }

    /*
     * Convert the manually entered directory path
     * into the frontend route.
     */
    function navigateToDirectory() {
        let value = inputPath.trim();

        if (!value) {
            return;
        }

        /*
         * Directory paths must always begin with /
         */
        if (!value.startsWith("/")) {
            value = `/${value}`;
        }

        /*
         * Normalize duplicate slashes.
         *
         * //workspace//project1
         * becomes
         * /workspace/project1
         */
        value = value.replace(/\/+/g, "/");

        /*
         * Don't allow the user to navigate above
         * the directory root.
         *
         * Since "/" is the root, there is nothing
         * above it.
         */
        if (value === "/") {
            router.push(FRONTEND_ROOT);
            setIsEditing(false);
            return;
        }

        /*
         * Remove trailing slash.
         */
        value = value.replace(/\/$/, "");

        /*
         * Convert:
         *
         * /workspace/project1
         *
         * into:
         *
         * /dashboard/myair/workspace/project1
         */
        const route = `${FRONTEND_ROOT}${value}`;

        router.push(route);
        setIsEditing(false);
    }

    function handleInputKeyDown(
        event: React.KeyboardEvent<HTMLInputElement>
    ) {
        if (event.key === "Enter") {
            navigateToDirectory();
        }

        if (event.key === "Escape") {
            setIsEditing(false);
        }
    }

    /*
     * Build breadcrumb items.
     *
     * Example:
     *
     * directoryPath =
     * ["workspace", "project1", "src"]
     *
     * generates:
     *
     * /
     * workspace
     * project1
     * src
     */
    const breadcrumbItems = directoryPath.map(
        (segment, index) => {
            const parentPath = directoryPath.slice(
                0,
                index + 1
            );

            const route = getRouteFromDirectoryPath(
                parentPath
            );

            const isCurrent =
                index === directoryPath.length - 1;

            return {
                segment,
                route,
                isCurrent,
            };
        }
    );

    return (
        <div
            onDoubleClick={startEditing}
            className="rounded-xl border bg-card px-4 py-1.5 transition-all"
        >
            {!isEditing ? (
                <Breadcrumb>
                    <BreadcrumbList>
                        {/* Directory root */}
                        <BreadcrumbItem>
                            {directoryPath.length === 0 ? (
                                <BreadcrumbPage>/</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink
                                    href={FRONTEND_ROOT}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        router.push(FRONTEND_ROOT);
                                    }}
                                >
                                    /
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>

                        {/* Directory children */}
                        {breadcrumbItems.map(
                            ({
                                segment,
                                route,
                                isCurrent,
                            }) => (
                                <React.Fragment key={route}>
                                    <BreadcrumbSeparator />

                                    <BreadcrumbItem>
                                        {isCurrent ? (
                                            <BreadcrumbPage>
                                                {formatName(segment)}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink
                                                href={route}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    router.push(route);
                                                }}
                                            >
                                                {formatName(segment)}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            )
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            ) : (
                <>
                    <span className="font-sans text-muted-foreground">myair:/</span>
                    <input
                        autoFocus
                        value={inputPath}
                        onChange={(event) =>
                            setInputPath(event.target.value)
                        }
                        onKeyDown={handleInputKeyDown}
                        onBlur={() => setIsEditing(false)}
                        className="min-w-[300px] bg-transparent outline-none"
                        placeholder="/"
                    />
                </>
            )}
        </div>
    );
}

export default PathNavigation;