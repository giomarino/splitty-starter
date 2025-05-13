import { Handler } from 'aws-lambda';
import { Order } from '@splitty-starter/core/order';

export const handler: Handler = async event => {
  const { order_id } = event.pathParameters;

  const order = await Order.read({
    order_id,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(order),
  };
};
