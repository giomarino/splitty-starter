import { api } from "./api";

export const web = new sst.aws.StaticSite("StaticSite", {
  path: "packages/frontend",
  build: {
    output: "dist",
    command: "npm run build",
  },
  environment: {
    VITE_API_URL: api.url,
    VITE_STRIPE_PUBLIC_KEY: 'pk_test_51RNdZY4UOaEyPusSH0QUdExVUFimZ9ZhtI9wsbIctL5rghmlRAHyKgvee2gSWeEwufWOCxBnSfV6QmqWAMuWxmPj00nzx3Umrn'
  },
});
