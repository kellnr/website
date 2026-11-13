export { latestMajor } from "@/utils/changelog";

/** Docker image of the newest major version; `__KELLNR_MAJOR__` is set at build time by vite.config.ts. */
export const KELLNR_IMAGE = `ghcr.io/kellnr/kellnr:${__KELLNR_MAJOR__}`;
