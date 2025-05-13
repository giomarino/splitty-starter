import { Handler } from "aws-lambda";
import { Order } from "@splitty-starter/core/order";

export const handler: Handler = async (event) => {
  const { order_id } = event.pathParameters;
  
  await Order.del({
    order_id
  });

  return {
    statusCode: 204,
  };
};
