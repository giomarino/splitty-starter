import { Handler } from "aws-lambda";
import { Order } from "@splitty-starter/core/order";

export const handler: Handler = async (event) => {
  const {
    name,
    amount,
    buyer_email
  } = JSON.parse(event.body as string);
  
  const order = await Order.create({
    name,
    amount,
    buyer_email,
  });

  return {
    statusCode: 201,
    body: JSON.stringify(order),
  };
};
