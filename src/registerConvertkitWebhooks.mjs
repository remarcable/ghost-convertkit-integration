import client from "./api/convertkitClient.mjs";
import {
  getTagIdFromLabel,
  getWebhookUrl,
  printActiveWebhooks,
} from "./api/convertkitAPI.mjs";
import inquirer from "inquirer";
import z from "zod";

const events = [
  "subscriber.subscriber_activate",
  "subscriber.subscriber_unsubscribe",
];

const { baseUrl, tags } = await inquirer.prompt([
  {
    name: "baseUrl",
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
  tags.filter(Boolean).map(async (label) => ({
    tagId: await getTagIdFromLabel({ label }),
    label,
  })),
);

const allEvents = [
  ...events.map((event) => ({
    name: event,
    extraData: {},
  })),
  ...tagIds.flatMap(({ tagId, label }) => [
    { name: "subscriber.tag_add", label, extraData: { tag_id: tagId } },
    { name: "subscriber.tag_remove", label, extraData: { tag_id: tagId } },
  ]),
];

console.log("Registering new webhooks...");

try {
  await Promise.all(
    allEvents.map(async ({ name, extraData, label }) => {
      await client.post("/automations/hooks", {
        target_url: getWebhookUrl({
          eventName: name,
          baseUrl,
          label,
        }),
        event: { name, ...extraData },
      });
    }),
  );

  console.log("Successfully registered webhooks...");
} catch (error) {
  console.log("Failed registering webhooks...", error);
}

await printActiveWebhooks();
