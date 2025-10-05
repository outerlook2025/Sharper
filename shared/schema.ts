import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  iconUrl: text("icon_url"),
  m3uUrl: text("m3u_url"),
  order: integer("order").default(0),
});

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  streamUrl: text("stream_url").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  authCookie: text("auth_cookie"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Category = typeof categories.$inferSelect;
export type Channel = typeof channels.$inferSelect;
