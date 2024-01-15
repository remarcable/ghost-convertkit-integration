import z from "zod";
import axios from "axios";

const { CONVERTKIT_API_SECRET } = z
  .object({
    CONVERTKIT_API_SECRET: z.string(),
  })
  .parse(process.env);

const client = axios.create({
  baseURL: "https://api.convertkit.com/v3",
  timeout: 20000,
  responseType: "json",
  params: {
    api_secret: CONVERTKIT_API_SECRET,
  },
});

export default client;
