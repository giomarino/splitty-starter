import { Entity, EntityItem, CustomAttributeType } from 'electrodb';
import { ulid } from 'ulid';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { Resource } from 'sst';
import Stripe from 'stripe';

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { renderFile } from 'ejs';
import { readFileSync } from 'fs';
import { join } from 'path';

const ses = new SESClient({});

const stripe = new Stripe(Resource.StripeApiKey.value, {
  apiVersion: '2022-11-15',
});

export type OrderStatus = 'pending' | 'completed';

export namespace Order {
  export const OrderEntity = new Entity(
    {
      model: {
        entity: 'order',
        version: '1',
        service: 'splitty-starter',
      },
      attributes: {
        order_id: {
          type: 'string',
          default: () => `or_${ulid().toLowerCase()}`,
          readOnly: true,
        },
        object: {
          type: 'string',
          default: () => 'order',
          readOnly: true,
        },
        status: {
          type: CustomAttributeType<OrderStatus>('string'),
          default: () => 'pending',
        },
        name: {
          type: 'string',
          required: true,
        },
        amount: {
          type: 'number',
          required: true,
        },
        stripe_payment_intent_client_secret: {
          type: 'string',
        },
        creation_email_sent_at: {
          type: 'number',
        },
        buyer_email: {
          type: 'string',
          required: true,
        },
        created_at: {
          type: 'number',
          default: () => Date.now(),
          readOnly: true,
        },
        updated_at: {
          type: 'number',
          watch: '*',
          set: () => Date.now(),
          readOnly: true,
        },
      },
      indexes: {
        primary: {
          pk: {
            field: 'pk',
            composite: ['order_id'],
          },
          sk: {
            field: 'sk',
            composite: [],
          },
        },
        object: {
          index: 'gsi1',
          pk: {
            field: 'gsi1pk',
            composite: ['object'],
          },
          sk: {
            field: 'gsi1sk',
            composite: ['created_at'],
          },
        },
      },
    },
    {
      table: Resource.Table.name,
      client: DynamoDBDocumentClient.from(new DynamoDBClient({}), {}),
    },
  );

  export type OrderEntityType = EntityItem<typeof OrderEntity>;

  // Core Methods
  type OrderCreateInput = {
    name: OrderStatus;
    amount: number;
    buyer_email: string;
  };
  export async function create(_: OrderCreateInput): Promise<OrderEntityType> {
    const order_id = `or_${ulid().toLowerCase()}`;

    const stripe_payment_intent = await stripe.paymentIntents.create({
      amount: _.amount,
      currency: 'eur',
      confirm: false,
      metadata: {
        order_id,
      },
    });

    const order = await OrderEntity.create({
      ..._,
      order_id,
      stripe_payment_intent_client_secret: stripe_payment_intent.client_secret || undefined,
      buyer_email: _.buyer_email,
    }).go();

    await publishOrderEvent('order.created', order.data);

    return order.data;
  }

  type OrderListInput = {};
  export async function list(_: OrderListInput): Promise<OrderEntityType[]> {
    const order = await OrderEntity.query
      .object({
        object: 'order',
      })
      .go();
    return order.data;
  }

  type OrderReadInput = {
    order_id: string;
  };
  export async function read(_: OrderReadInput): Promise<OrderEntityType | null> {
    const order = await OrderEntity.get(_).go();
    return order.data;
  }

  type OrderPayInput = {
    order_id: string;
  };
  export async function pay(_: OrderPayInput): Promise<OrderEntityType | null> {
    const order = await OrderEntity.patch({ order_id: _.order_id })
      .set({ status: 'completed' as OrderStatus })
      .go({ response: 'all_new' });
    return order.data;
  }

  type OrderDeleteInput = {
    order_id: string;
  };
  export async function del(_: OrderDeleteInput): Promise<void> {
    const order = await OrderEntity.remove(_).go({ response: 'all_old' });
    return;
  }

  type OrderSendCreationEmailInput = {
    order_id: string;
    name: string;
    amount: number;
    buyer_email: string;
  };
  export async function sendCreationEmail(_: OrderSendCreationEmailInput): Promise<OrderEntityType> {
    const { order_id, ...atts } = _;

    const template_path = join(process.cwd(), 'packages/email/ejs/order-created.ejs');

    const html = await renderFile(template_path, atts);

    await ses.send(
      new SendEmailCommand({
        Source: Resource.NoReplyEmail.sender,
        Destination: {
          ToAddresses: [_.buyer_email],
        },
        Message: {
          Subject: {
            Data: 'Splitty Starter - Ordine Creato',
          },
          Body: {
            Html: {
              Data: html,
            },
          },
        },
      }),
    );

    const order = await OrderEntity.patch({ order_id })
      .set({ creation_email_sent_at: Date.now() })
      .go({ response: 'all_new' });

    return order.data;
  }

  // EventBridge
  const client = new EventBridgeClient({});

  interface Events {
    'order.succeeded': OrderEntityType;
    'order.created': OrderEntityType;
  }
  export type OrderEventTypes = keyof Events;

  export async function publishOrderEvent<T extends OrderEventTypes>(type: T, properties: Events[T]) {
    const event_payload = {
      Entries: [
        {
          EventBusName: Resource.OrderEventBus.name,
          Source: type,
          DetailType: 'order',
          Detail: JSON.stringify(properties),
        },
      ],
    };

    const event_command = new PutEventsCommand(event_payload);

    return client.send(event_command);
  }
}
