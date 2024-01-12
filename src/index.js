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

// current deployment: https://233zx64y80.execute-api.us-east-1.amazonaws.com/

// need a simple script to setup the integration, i.e. create webhooks both in ghost and ck

// Most important things:
// subscribe on ck => ghost
// unsubscibre ck => ghost
// un/sub ghost => ck

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2,
    ),
  };
};

const createGhostMember = () => {};
const createConvertkitMember = () => {};

const unsubscribeGhostMember = () => {};
const unsubscribeConvertkitMember = () => {};

const addTagToGhostSubscriber = () => {};
const removeTagFromGhostSubscriber = () => {};
