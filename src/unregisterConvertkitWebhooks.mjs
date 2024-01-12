import client from "./convertkitClient.mjs";
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

const webhooks = await client.get("/automations/hooks").then((res) => res.data);

console.log("The following webhooks are still registered:");
webhooks.forEach((hook) => {
  const { rule } = hook;
  console.log(
    `${rule.id} | ${rule.event.name} ${rule.event.tag_id ?? ""} | ${
      rule.target_url
    }`,
  );
});
