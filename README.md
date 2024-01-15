# Ghost ConvertKit Integration

This [serverless](https://github.com/serverless/serverless) function integrates/connects Ghost and ConvertKit through their webhooks and APIs.

## Motivation

The official "integration" for Ghost and ConverKit is a set of [Zaps](https://ghost.org/integrations/convertkit/#sync-ghost-members-to-convertkit). As they weren't complete enough for my use case and paying for Zapier was too expensive for my personal blog, I created this serverless function to connect the two. This integration (without quotes) is a much more robust integration and easy to customize.

## Features

- Sync confirmed subscribers between ConvertKit and Ghost
- Subscribe confirmed Ghost members to ConvertKit sequence (without retriggering another confirmation email)
- Sync unsubscribes between ConvertKit and Ghost
- Sync tags between ConvertKit and Ghost
- Sync resubscribes from ConvertKit to Ghost
- Free deployment to AWS Lambda (compared to more than $20 with Zapier)
- Easy registration of webhooks using custom scripts
- Easy to extend and customize for other needs (create an issue and/or PR!)

#### Missing Features

The following features are missing because it's not possible to delete members using the ConvertKit API or triggering a resubscribe using ConvertKit.

- Sync resubscribes from Ghost to ConvertKit (other way round should work)
- Sync deletions between Ghost and ConvertKit

#### Under consideration:

- Publish as a stand-alone integration so it is simple to use and install

## Usage

To deploy or develop this integration, you need the following values and put them into `.env`:

- `CONVERTKIT_API_SECRET`: ConvertKit [API Secret](https://app.convertkit.com/account_settings/advanced_settings)
- `CONVERTKIT_SEQUENCE_ID`: ConvertKit Sequence ID (Open the [Sequence](https://app.convertkit.com/sequences) in the interface and note the last part in the URL, e.g. `1651234` in `https://app.convertkit.com/sequences/1651234`)
- `GHOST_ADMIN_API_KEY` API key of a new custom integration. Go to `Settings > Integrations` and click on "Add custom integration". Copy the Admin API key.
- `GHOST_API_URL` Copy the API URL from your integration (should be the same as your Ghost blog, e.g. `https://www.example.com` without the trailing `/ghost`)

### Local Development

#### Installation

```bash
npm install
cp .env.sample .env # Fill in the values from above
npm start
```

#### Tunneling webhooks

You can use [ngrok](https://ngrok.com/docs/getting-started/) to locally test the webhooks. In another terminal window, run:

```bash
ngrok http 3000
```

Copy the public URL for the next step of registering the webhooks. It should look like `https://abcd-ef-gh-i-jkl.ngrok-free.app`.

#### Registering ConvertKit webhooks

To register the webhooks, run the following command:

```bash
node src/scripts/registerConvertkitWebhooks.mjs
```

Paste the ngrok URL from the last step and provide a list of tags you want to sync. With ConvertKit, it is only possible to sync tags that were explicitly provided. When you are done, you should see something like the following:

```
The following webhooks are currently registered:
1001234 | subscriber_unsubscribe | https://abcd-ef-gh-i-jkl.ngrok-free.app/convertkit/subscriber.subscriber_unsubscribe/
1001235 | subscriber_activate | https://abcd-ef-gh-i-jkl.ngrok-free.app/convertkit/subscriber.subscriber_activate/
1001236 | tag_add | https://abcd-ef-gh-i-jkl.ngrok-free.app/convertkit/subscriber.tag_add/finished-yearly
1001238 | tag_remove | https://abcd-ef-gh-i-jkl.ngrok-free.app/convertkit/subscriber.tag_remove/finished-yearly
```

#### Registering Ghost webhooks

Repeat this step with the Ghost integration:

```bash
node src/scripts/registerGhostWebhooks.mjs
```

Verify that it worked correctly by visiting the link to your integration that is printed on the console. You should see webhooks for the events `member.added`, `member.edited`, and `member.deleted`.

After completing those steps, ConvertKit and Ghost are integrated through your locally running serverless function. For production use, follow the steps below to run it with AWS.

### Deployment

Setup your [AWS credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) before deployment and follow the steps above. Then run the following command:

```bash
$ npm run deploy
```

After deploying, you should see an output similar to this:

```
Deploying aws-node-ghost-convertkit-integration to stage production (us-east-1)

✔ Service deployed to stack aws-node-ghost-convertkit-integration-production (152s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  ghost-ck-integration: aws-node-ghost-convertkit-integration-production (1.9 kB)
```

#### Registering ConvertKit and Ghost webhooks

Register the deployment URL in Ghost and ConvertKit:

```bash
node src/scripts/registerConvertkitWebhooks.mjs

# and then afterwards
node src/scripts/registerGhostWebhooks.mjs
```

#### Unregistering local webhook endpoints

If you've set up the webhooks locally, remove them after registering the production endpoint using the following script:

```bash
node src/scripts/unregisterConvertkitWebhooks.mjs
```

For Ghost, it isn't possible to delete the old webhooks programmatically, so you need to visit your integration in `Ghost Settings > Integrations > Custom > <Your Integration>` and remove them manually.

## Done 🎉

Enjoy your stress-free no-quotes integration between Ghost and ConvertKit.
