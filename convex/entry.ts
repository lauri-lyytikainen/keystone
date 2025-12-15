import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getEntries = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const entries = await ctx.db.query("dailyEntries").collect();
    return entries;
  },
});

export const addEntry = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const entryId = await ctx.db.insert("dailyEntries", { text });
    return entryId;
  },
});
