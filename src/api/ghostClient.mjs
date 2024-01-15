import GhostAdminAPI from "@tryghost/admin-api";
import z from "zod";

const { GHOST_API_URL, GHOST_ADMIN_API_KEY } = z
  .object({
    GHOST_API_URL: z.string().url(),
    GHOST_ADMIN_API_KEY: z.string(),
  })
  .parse(process.env);

export { GHOST_API_URL };
export default new GhostAdminAPI({
  url: GHOST_API_URL,
  key: GHOST_ADMIN_API_KEY,
  version: "v5.71",
});
