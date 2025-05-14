import { table } from './database';
import { secret_collection } from './secret';
import { no_reply_email } from './email';


export const order_event_bus = new sst.aws.Bus('OrderEventBus');

order_event_bus.subscribe('order-event-subscriber', {
  name: 'splitty-starter-order-event-bus-handler',
  handler: './packages/subscriber/src/order.handler',
  link: [table, no_reply_email, ...secret_collection],
  copyFiles: [
    { from: './packages/email/ejs' }
  ],
  environment: {
    LUMIGO_DEBUG: 'true',
  },
  permissions: [
    {
      actions: ['ses:SendEmail'],
      resources: ['*'],
    },
  ],
  timeout: '30 seconds',
  tags: {
    'lumigo:auto-trace': 'true',
  },
});
