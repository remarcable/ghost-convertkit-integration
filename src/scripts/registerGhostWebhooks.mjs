import "dotenv/config";
import inquirer from "inquirer";
import z from "zod";
import { registerWebhook } from "../api/ghostAPI.mjs";
import { GHOST_API_URL } from "../api/ghostClient.mjs";

const events = ["member.added", "member.edited", "member.deleted"];

const { baseUrl } = await inquirer.prompt([
  {
    name: "baseUrl",
    message: "What is your deployment URL for the serverless function?",
    validate: z.string().url().validate,
  },
]);

console.log("Registering new webhooks...");

try {
  const results = await Promise.all(
    events.map(async (event) => registerWebhook({ event, baseUrl })),
  );

  const [firstResult] = results;
  const integrationId = firstResult.integration_id;

  console.log("Successfully registered webhooks...");
  console.log(
    `Check your webhooks at ${GHOST_API_URL}/ghost/#/settings/integrations/${integrationId}`,
  );
} catch (error) {
  console.log("Failed registering webhooks...", error);
}
