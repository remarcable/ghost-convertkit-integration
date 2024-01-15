import { handleConvertkitEvent } from "./handlers/convertkit.mjs";
import { handleGhostEvent } from "./handlers/ghost.mjs";
import { notFoundResponse } from "./api/responses.mjs";

export const handler = async (event) => {
  const { rawPath } = event;
  const [service, eventName, extraInfo] = rawPath.split("/").slice(1);

  if (service === "convertkit") {
    return handleConvertkitEvent({ eventName, event, extraInfo });
  }

  if (service === "ghost") {
    return handleGhostEvent({ eventName, event, extraInfo });
  }

  return notFoundResponse;
};
