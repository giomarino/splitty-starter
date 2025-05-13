import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  console.info(event);
  return;
};
