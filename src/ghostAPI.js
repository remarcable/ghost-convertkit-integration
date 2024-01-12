const GhostAdminAPI = require("@tryghost/admin-api");
const z = require("zod");

const { GHOST_URL, GHOST_API_KEY } = z
  .object({
    GHOST_URL: z.string().url(),
    GHOST_API_KEY: z.string(),
  })
  .parse(process.env);

const api = new GhostAdminAPI({
  url: GHOST_URL,
  key: GHOST_API_KEY,
  version: "v5.71",
});

const subscribeGhostMember = async ({ name, email }) => {
  const member = await getGhostMemberByEmail({ email });

  if (member) {
    return resubscribeGhostMember({ id: member.id });
  }

  return createGhostMember({ name, email });
};

const getGhostMemberByEmail = async ({ email }) => {
  const [member] = await api.members.browse({
    filter: `email:'${email}'`,
    limit: 1,
  });

  return member;
};

const createGhostMember = async ({ name, email }) => {
  const newsletters = await api.newsletters.browse();

  return api.members.add({
    name,
    email,
    newsletters: newsletters.map((newsletter) => ({
      id: newsletter.id,
      status: "active",
    })),
  });
};

const unsubscribeGhostMember = async ({ email }) => {
  const member = await getGhostMemberByEmail({ email });

  if (!member) {
    throw new Error("Member not found");
  }

  return api.members.edit({ id: member.id, newsletters: [] });
};

const resubscribeGhostMember = async ({ id }) => {
  const newsletters = await api.newsletters.browse();
  return api.members.edit({
    id,
    newsletters: newsletters.map((newsletter) => ({
      id: newsletter.id,
      status: "active",
    })),
  });
};

const addLabelToGhostSubscriber = async ({ email, labelName }) => {
  const member = await getGhostMemberByEmail({ email });

  if (!member) {
    throw new Error("Member not found");
  }

  api.members.edit({
    id: member.id,
    labels: [...member.labels, { name: labelName }],
  });
};

const removeLabelFromGhostSubscriber = async ({ email, labelName }) => {
  const member = await getGhostMemberByEmail({ email });

  if (!member) {
    throw new Error("Member not found");
  }

  return api.members.edit({
    id: member.id,
    labels: member.labels.filter((label) => label.name !== labelName),
  });
};

module.exports = {
  subscribeGhostMember,
  unsubscribeGhostMember,
  addLabelToGhostSubscriber,
  removeLabelFromGhostSubscriber,
};
