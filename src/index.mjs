import { handleConvertkitEvent } from "./handlers/convertkit.mjs";
import { handleGhostEvent } from "./handlers/ghost.mjs";
import { notFoundResponse, successResponse } from "./api/responses.mjs";

export const handler = async (event) => {
  const { rawPath, source, body } = event;

  if (source === "serverless-plugin-warmup") {
    console.log("Warmup - Lambda is warm!");
    return successResponse;
  }

  const payload = JSON.parse(body ?? "{}");
  const [service, eventName, extraInfo] = rawPath.split("/").slice(1);
  console.log("New event for", { service, eventName, extraInfo });

  if (service === "convertkit") {
    return handleConvertkitEvent({ eventName, payload, extraInfo });
  }

  if (service === "ghost") {
    return handleGhostEvent({ eventName, payload, extraInfo });
  }

  return notFoundResponse;
};
