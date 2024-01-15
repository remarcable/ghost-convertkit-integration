import z from "zod";
import axios from "axios";
import axiosRetry from "axios-retry";

const { CONVERTKIT_API_SECRET } = z
  .object({
    CONVERTKIT_API_SECRET: z.string(),
  })
  .parse(process.env);

const client = axios.create({
  baseURL: "https://api.convertkit.com/v3",
  timeout: 25000,
  responseType: "json",
  params: {
    api_secret: CONVERTKIT_API_SECRET,
  },
});

axiosRetry(client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  onRetry: (retryCount, error) => {
    console.log(
      `Retrying ConvertKit request for the ${retryCount}. time after error`,
      error,
    );
  },
});

export default client;
