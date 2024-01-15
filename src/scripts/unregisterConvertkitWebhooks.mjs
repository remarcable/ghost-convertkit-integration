import {
  getActiveWebhooks,
  printActiveWebhooks,
  webhookToString,
} from "../api/convertkitAPI.mjs";
import client from "../api/convertkitClient.mjs";
import inquirer from "inquirer";

const webhooks = await getActiveWebhooks();

const { ruleIds } = await inquirer.prompt([
  {
    type: "checkbox",
    name: "ruleIds",
    message: "Which webhooks should be removed?",
    choices: webhooks.map((webhook) => ({
      name: webhookToString(webhook),
      value: webhook.rule.id,
    })),
  },
]);

console.log(ruleIds);

console.log("Removing webhooks...");

try {
  await Promise.all(
    ruleIds.map(async (ruleId) => {
      await client.delete(`/automations/hooks/${ruleId}`);
    }),
  );

  console.log("Successfully removed webhooks...");
} catch (error) {
  console.log("Failed removing webhooks...");
}

await printActiveWebhooks();
