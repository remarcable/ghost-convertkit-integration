import {
  addLabelToGhostSubscriber,
  removeLabelFromGhostSubscriber,
  subscribeGhostMember,
  unsubscribeGhostMember,
} from "../api/ghostAPI.mjs";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "../api/responses.mjs";

export const handleConvertkitEvent = async ({
  eventName,
  event,
  extraInfo,
}) => {
  const { body } = event;
  const payload = JSON.parse(body);

  const email = payload?.subscriber?.email_address;
  if (!email) {
    return errorResponse;
  }

  switch (eventName) {
    case "subscriber.subscriber_activate": {
      const name = payload?.subscriber?.first_name;
      await subscribeGhostMember({ email, name });
      break;
    }
    case "subscriber.subscriber_unsubscribe": {
      await unsubscribeGhostMember({ email });
      break;
    }
    case "subscriber.tag_add": {
      const label = extraInfo;
      await addLabelToGhostSubscriber({ email, label });
      break;
    }
    case "subscriber.tag_remove": {
      const label = extraInfo;
      await removeLabelFromGhostSubscriber({ email, label });
      break;
    }
    default: {
      return notFoundResponse;
    }
  }
  return successResponse;
};
