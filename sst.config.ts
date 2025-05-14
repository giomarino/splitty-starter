/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "splitty-starter",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: input?.stage + '-splittypay'
        }
      }
    };
  },
  
  async run() {
    const infra = await import("./infra");

    return {
      api: infra.api.url,
    };
  },
});
