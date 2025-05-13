import { Handler } from 'aws-lambda';
import { Order } from '@splitty-starter/core/order';

export const handler: Handler = async event => {
  const payload = JSON.parse(event.body)

  if (payload.type === 'charge.succeeded') {
    const { order_id } = payload.data.object.metadata;

    await Order.pay({ order_id });
  }

  return {
    statusCode: 204,
  };
};
