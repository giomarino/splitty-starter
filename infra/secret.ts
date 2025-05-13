export const secret = {
  StripeApiKey: new sst.Secret('StripeApiKey'),
};

export const secret_collection = Object.values(secret);
