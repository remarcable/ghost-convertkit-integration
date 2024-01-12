export const handleConvertkitEvent = async ({ eventName, event }) => {
  console.log(eventName);
  return { statusCode: 200, body: JSON.stringify({ status: 200 }, null, 2) };
};
