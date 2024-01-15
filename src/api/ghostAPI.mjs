import client from "./ghostClient.mjs";

export const subscribeGhostMember = async ({ name, email }) => {
  const member = await getGhostMemberByEmail({ email });

  // TODO: maybe add logic here with createdAt so member
  // isn't updated multiple times during registration
  // Similar to other API calls and webhooks: how do we prevent
  // an infinite loop? I.e. how do we know that certain requests
  // are referring to exactly the same thing?

  if (member) {
    return resubscribeGhostMember({ id: member.id });
  }

  return createGhostMember({ name, email });
};

const getGhostMemberByEmail = async ({ email }) => {
  const [member] = await client.members.browse({
    filter: `email:'${email}'`,
    limit: 1,
  });

  return member;
};

const createGhostMember = async ({ name, email }) => {
  const newsletters = await client.newsletters.browse();

  return client.members.add({
    name,
    email,
    newsletters: newsletters.map((newsletter) => ({
      id: newsletter.id,
      status: "active",
    })),
  });
};

export const unsubscribeGhostMember = async ({ email }) => {
  const member = await getGhostMemberByEmail({ email });

  if (!member) {
    throw new Error("Member not found");
  }

  return client.members.edit({ id: member.id, newsletters: [] });
};

const resubscribeGhostMember = async ({ id }) => {
  const newsletters = await client.newsletters.browse();
  return client.members.edit({
    id,
    newsletters: newsletters.map((newsletter) => ({
      id: newsletter.id,
      status: "active",
    })),
  });
};

export const addLabelToGhostSubscriber = async ({ email, label }) => {
  const member = await getGhostMemberByEmail({ email });

  if (!member) {
    throw new Error("Member not found");
  }

  client.members.edit({
    id: member.id,
    labels: [...member.labels, { name: label }],
  });
};

export const removeLabelFromGhostSubscriber = async ({ email, label }) => {
  const member = await getGhostMemberByEmail({ email });

  if (!member) {
    throw new Error("Member not found");
  }

  return client.members.edit({
    id: member.id,
    labels: member.labels.filter((l) => l.name !== label),
  });
};

export const registerWebhook = async ({ event, baseUrl }) => {
  return client.webhooks.add({
    name: `Sync ${event}`,
    event,
    target_url: `${baseUrl}/ghost/${event}`,
  });
};
