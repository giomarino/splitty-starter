import { Order } from "@splitty-starter/core/order";
import { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  let order = event.detail as Order.OrderEntityType;
  
  switch(event.source) {
    case 'order.created': {
      order = await Order.sendCreationEmail({
        order_id: order.order_id,
        name: order.name,
        amount: order.amount,
        buyer_email: order.buyer_email
      });
      break;
    }
    default: {
      console.info(`Unhandled order event type: ${event.type}`);
    }  
  }

  return order;
};
