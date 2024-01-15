import {
  addLabelToConvertkitSubscriber,
  removeLabelFromConvertkitSubscriber,
  subscribeConvertkitMember,
  unsubscribeConvertkitMember,
} from "../api/convertkitAPI.mjs";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
} from "../api/responses.mjs";

export const handleGhostEvent = async ({ eventName, event }) => {
  const { body } = event;
  const payload = JSON.parse(body);
  const email =
    payload?.member?.current?.email ?? payload?.member?.previous?.email;

  if (!email) {
    return errorResponse;
  }

  switch (eventName) {
    case "member.added": {
      const name = payload?.member?.current?.name;

      if (!name) {
        console.log("No name provided");
      }

      await subscribeConvertkitMember({ email, name });
      break;
    }
    case "member.edited": {
      const previousNewsletters = payload?.member?.previous?.newsletters;
      const currentNewsletters = payload?.member?.current?.newsletters;
      if (previousNewsletters && currentNewsletters) {
        // TODO: Check for differences in newsletters instead of this "simple" heuristic

        if (previousNewsletters.length > currentNewsletters.length) {
          await unsubscribeConvertkitMember({ email });
        } else if (previousNewsletters.length < currentNewsletters.length) {
          const name = payload?.member?.current?.name;
          await subscribeConvertkitMember({ email, name });
        }
      }

      const previousLabels = payload?.member?.previous?.labels;
      const currentLabels = payload?.member?.current?.labels;
      if (previousLabels && currentLabels) {
        const previousLabelNames = previousLabels.map((label) => label.name);
        const currentLabelNames = currentLabels.map((label) => label.name);

        const labelsToAdd = currentLabelNames.filter(
          (label) => !previousLabelNames.includes(label),
        );

        const labelsToRemove = previousLabelNames.filter(
          (label) => !currentLabelNames.includes(label),
        );

        await Promise.all([
          ...labelsToAdd.map(
            (label) => addLabelToConvertkitSubscriber({ email, label }),
            ...labelsToRemove.map((label) =>
              removeLabelFromConvertkitSubscriber({ email, label }),
            ),
          ),
        ]);
      }

      break;
    }
    case "member.deleted": {
      // there isn't anything like that in CovertKit API, I guess?
      // because an unsubscribe in ghost is just an edit
      // so let's just unsubscribe here to be sure without
      // deleting the member from ConvertKit

      await unsubscribeConvertkitMember({ email });
      break;
    }
    default: {
      return notFoundResponse;
    }
  }

  console.log("Successfully handled Ghost event");
  return successResponse;
};
