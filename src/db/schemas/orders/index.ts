import { numeric, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { customers } from '../customers/index.js';

const orderStatus = pgEnum('order_status', [
  'pending',
  'confirmed',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
  'failed',
  'expired',
]);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customer_id: uuid('customer_id')
    .references(() => customers.id)
    .notNull(),
  amount: numeric('amount').notNull(),
  status: orderStatus('status').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});
