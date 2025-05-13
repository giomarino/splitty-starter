import { Handler } from "aws-lambda";
import { Order } from "@splitty-starter/core/order";

export const handler: Handler = async (event) => {
  const order_collection = await Order.list({})
  
  return {
    statusCode: 200,
    body: JSON.stringify(order_collection),
  };
};
