// Things to create:
// Sync subscribes convertkit => ghost
// Sync subscribes ghost => convertkit
// Sync unsubscribes convertkit => ghost
// Sync unsubscribes ghost => convertkit

// nice to have:
// Sync tags from convertkit to ghost (and vice versa)
// => needed to know when a sequence was completed
// also in ghost: what happens when user resubscribe?
// also in ck: what happens when users sign up multiple times or for multiple forms?

// TODO: following URL is now in git. Might need a secret for the webhooks
// current deployment: https://233zx64y80.execute-api.us-east-1.amazonaws.com/

// need a simple script to setup the integration, i.e. create webhooks both in ghost and ck

// Most important things:
// subscribe on ck => ghost
// unsubscibre ck => ghost
// un/sub ghost => ck

import { handleConvertkitEvent } from "./handleConvertkitEvent.mjs";
import { handleGhostEvent } from "./handleGhostEvent.mjs";

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
