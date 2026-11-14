import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261114211441 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "fk_stock_cause" ("id" text not null, "inventory_item_id" text not null, "location_id" text not null, "previous_quantity" integer not null, "cause" text check ("cause" in ('shipped', 'returned', 'manual', 'reset', 'other')) not null, "order_id" text null, "order_display_id" integer null, "actor_name" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fk_stock_cause_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fk_stock_cause_inventory_item_id" ON "fk_stock_cause" ("inventory_item_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fk_stock_cause_deleted_at" ON "fk_stock_cause" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "fk_stock_change" ("id" text not null, "inventory_item_id" text not null, "location_id" text not null, "previous_quantity" integer null, "new_quantity" integer not null, "cause" text check ("cause" in ('shipped', 'returned', 'manual', 'reset', 'other')) not null, "order_id" text null, "order_display_id" integer null, "actor_name" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fk_stock_change_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fk_stock_change_inventory_item_id" ON "fk_stock_change" ("inventory_item_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fk_stock_change_deleted_at" ON "fk_stock_change" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "fk_stock_seen" ("id" text not null, "inventory_item_id" text not null, "location_id" text not null, "quantity" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fk_stock_seen_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fk_stock_seen_inventory_item_id" ON "fk_stock_seen" ("inventory_item_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_fk_stock_seen_deleted_at" ON "fk_stock_seen" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "fk_stock_cause" cascade;`);

    this.addSql(`drop table if exists "fk_stock_change" cascade;`);

    this.addSql(`drop table if exists "fk_stock_seen" cascade;`);
  }

}
