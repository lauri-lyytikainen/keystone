import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  dailyEntries: defineTable({
    text: v.string(),
    date: v.string(), // ISO date string, e.g. "2025-12-16"
    user: v.string(), // User identifier from auth
  })
    .index("by_user", ["user"])
    .index("by_date", ["date"])
    .index("by_user_and_date", ["user", "date"]),
});
