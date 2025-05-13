import { table } from './database';
import { secret_collection } from './secret';

export const order_event_bus = new sst.aws.Bus('OrderEventBus');

order_event_bus.subscribe('order-event-subscriber', {
    name: 'splitty-starter-order-event-bus-handler',
    handler: './packages/subscriber/src/order.handler',
    link: [table, ...secret_collection],
    environment: {
      NOREPLY_EMAIL: 'no-reply@splitty.com',
    },
    permissions: [
      {
        actions: ['ses:SendEmail'],
        resources: ['*'],
      },
    ],
    timeout: '30 seconds',
  }
);