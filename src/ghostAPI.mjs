import client from "./ghostClient";

export const subscribeGhostMember = async ({ name, email }) => {
  const member = await getGhostMemberByEmail({ email });

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

export const addLabelToGhostSubscriber = async ({ email, labelName }) => {
  const member = await getGhostMemberByEmail({ email });

  if (!member) {
    throw new Error("Member not found");
  }

  client.members.edit({
    id: member.id,
    labels: [...member.labels, { name: labelName }],
  });
};

export const removeLabelFromGhostSubscriber = async ({ email, labelName }) => {
  const member = await getGhostMemberByEmail({ email });

  if (!member) {
    throw new Error("Member not found");
  }

  return client.members.edit({
    id: member.id,
    labels: member.labels.filter((label) => label.name !== labelName),
  });
};
