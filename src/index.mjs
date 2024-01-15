import { handleConvertkitEvent } from "./handlers/convertkit.mjs";
import { handleGhostEvent } from "./handlers/ghost.mjs";

export const handler = async (event) => {
  const { rawPath } = event;
  const [service, eventName, extraInfo] = rawPath.split("/").slice(1);

  if (service === "convertkit") {
    return handleConvertkitEvent({ eventName, event, extraInfo });
  }

  if (service === "ghost") {
    return handleGhostEvent({ eventName, event, extraInfo });
  }

  return {
    statusCode: 404,
    body: JSON.stringify(
      {
        status: 404,
        message: "Service not found",
      },
      null,
      2,
    ),
  };
};
