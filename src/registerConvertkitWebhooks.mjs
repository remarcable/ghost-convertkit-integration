import client from "./convertkitClient.mjs";
import { getTagIdFromLabel } from "./convertkitAPI.mjs";
import inquirer from "inquirer";
import z from "zod";

const events = [
  "subscriber.subscriber_activate",
  "subscriber.subscriber_unsubscribe",
];

const { webhookUrl, tags } = await inquirer.prompt([
  {
    name: "webhookUrl",
    message: "What is your deployment URL for the serverless function?",
    validate: z.string().url().validate,
  },
  {
    name: "tags",
    message:
      "Which labels should be synced? (separate by comma without spaces)",
    filter: (tag) => tag.split(","),
  },
]);

const tagIds = await Promise.all(
  tags.filter(Boolean).map((tag) => getTagIdFromLabel({ label: tag })),
);

const allEvents = [
  ...events.map((event) => ({
    name: event,
    extraData: {},
  })),
  ...tagIds.flatMap((tagId) => [
    { name: "subscriber.tag_add", extraData: { tag_id: tagId } },
    { name: "subscriber.tag_remove", extraData: { tag_id: tagId } },
  ]),
];

console.log("Registering new webhooks...");

try {
  await Promise.all(
    allEvents.map(async ({ name, extraData }) => {
      await client.post("/automations/hooks", {
        target_url: webhookUrl,
        event: { name, ...extraData },
      });
    }),
  );

  console.log("Successfully registered webhooks...");
} catch (error) {
  console.log("Failed registering webhooks...");
}

const webhooks = await client.get("/automations/hooks").then((res) => res.data);

console.log("The following webhooks are now registered:");
webhooks.forEach((hook) => {
  const { rule } = hook;
  console.log(
    `${rule.id} | ${rule.event.name} ${rule.event.tag_id ?? ""} | ${
      rule.target_url
    }`,
  );
});
