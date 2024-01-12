import z from "zod";
import client from "./convertkitClient.mjs";

const { CONVERTKIT_SEQUENCE_ID } = z
  .object({
    CONVERTKIT_SEQUENCE_ID: z.string(),
  })
  .parse(process.env);

const subscribeConvertkitMember = async ({ name, email }) => {
  const member = await getConvertkitMemberByEmail({ email });

  if (member && member.state === "active") {
    return;
  }

  // TODO: If the member is canceled, then the following doesn't work.
  // Workaround is to delete the subscriber and then resubscribe
  // But how can we resubscribe them without triggering a new sequence?

  // Not important for now because people can resubscribe
  // by signing up again with the CK form, not just in Ghost
  // BUT this might be a way for the data to go out of sync

  return client
    .post(`/sequences/${CONVERTKIT_SEQUENCE_ID}/subscribe`, {
      email,
      first_name: name,
    })
    .then((res) => res.data);
};

const getConvertkitMemberByEmail = async ({ email }) => {
  return client
    .get("/subscribers", {
      params: {
        email_address: email,
      },
    })
    .then((res) => res?.data?.subscribers?.[0]);
};

const unsubscribeConvertkitMember = async ({ email }) => {
  return client.put("/unsubscribe", { email }).then((res) => res?.data);
};

const addLabelToConvertkitSubscriber = async ({ email, label }) => {
  let tagId = await getTagIdFromLabel({ label });
  if (!tagId) {
    tagId = await createNewLabel({ label });
  }

  return client.post(`/tags/${tagId}/subscribe`, { email });
};

const removeLabelFromConvertkitSubscriber = async ({ email, label }) => {
  const tagId = await getTagIdFromLabel({ label });

  if (!tagId) {
    return;
  }

  return client
    .post(`/tags/${tagId}/unsubscribe`, { email })
    .then((res) => res?.data);
};

const createNewLabel = async ({ label }) => {
  const tag = await client
    .post(`/tags`, { tag: { name: label } })
    .then((res) => res.data);

  return tag.id;
};

const getTagIdFromLabel = async ({ label }) => {
  const tags = await client.get("/tags").then((res) => res?.data?.tags);
  return tags.filter((tag) => tag.name === label)?.[0]?.id;
};

export {
  subscribeConvertkitMember,
  unsubscribeConvertkitMember,
  addLabelToConvertkitSubscriber,
  removeLabelFromConvertkitSubscriber,
  getTagIdFromLabel,
};
