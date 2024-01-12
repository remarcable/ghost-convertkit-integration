import GhostAdminAPI from "@tryghost/admin-api";
import z from "zod";

const { GHOST_URL, GHOST_API_KEY } = z
  .object({
    GHOST_URL: z.string().url(),
    GHOST_API_KEY: z.string(),
  })
  .parse(process.env);

export default new GhostAdminAPI({
  url: GHOST_URL,
  key: GHOST_API_KEY,
  version: "v5.71",
});
