import { printActiveWebhooks } from "./api/convertkitAPI.mjs";
import client from "./api/convertkitClient.mjs";
import inquirer from "inquirer";

const { ruleIds } = await inquirer.prompt([
  {
    name: "ruleIds",
    message:
      "Which webhooks should be removed? (provide comma-separated list of rule IDs)",
    filter: (rule) => rule.split(","),
  },
]);

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
