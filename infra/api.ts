import { table } from './database';
import { secret_collection } from './secret';
import { order_event_bus } from './bus';

export const api = new sst.aws.ApiGatewayV2('Api', {
  cors: true,
  transform: {
    route: {
      handler: {
        link: [table, ...secret_collection],
        permissions: [{ actions: ['*'], resources: ['*'] }],
      },
    },
  },
});

api.route(
  'POST /order',
  {
    handler: './packages/api/src/create-order.handler',
    name: 'splitty-starter-create-order',
    link: [table, order_event_bus, ...secret_collection],
  },
  { auth: false },
);

api.route(
  'GET /order',
  {
    handler: './packages/api/src/list-order.handler',
    name: 'splitty-starter-list-order',
    link: [table, ...secret_collection],
  },
  { auth: false },
);

api.route(
  'GET /order/{order_id}',
  {
    handler: './packages/api/src/read-order.handler',
    name: 'splitty-starter-read-order',
    link: [table, ...secret_collection],
  },
  { auth: false },
);

api.route(
  'DELETE /order/{order_id}',
  {
    handler: './packages/api/src/delete-order.handler',
    name: 'splitty-starter-delete-order',
    link: [table, ...secret_collection],
  },
  { auth: false },
);

api.route(
  'POST /stripe-webhook',
  {
    handler: './packages/api/src/stripe-webhook.handler',
    name: 'splitty-starter-stripe-webhook',
    link: [table, ...secret_collection],
  },
  { auth: false },
);
