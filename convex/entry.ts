import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all entries for the current user for a specific month and year
export const getEntries = query({
  args: {
    month: v.number(),
    year: v.number(),
  },

  handler: async (ctx, { month, year }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const identityToken = identity.tokenIdentifier;

    // Create date range for the month
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endDate = `${year}-${(month + 1).toString().padStart(2, "0")}-01`;

    const entries = await ctx.db
      .query("dailyEntries")
      .withIndex("by_user", (q) => q.eq("user", identityToken))
      .filter(
        (q) =>
          q.gte(q.field("date"), startDate) && q.lt(q.field("date"), endDate),
      )
      .collect();
    return entries;
  },
});

// Get a specific entry by date
export const getEntryByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const identityToken = identity.tokenIdentifier;
    const entry = await ctx.db
      .query("dailyEntries")
      .withIndex("by_user_and_date", (q) =>
        q.eq("user", identityToken).eq("date", date),
      )
      .unique();
    return entry;
  },
});

export const addEntry = mutation({
  args: { text: v.string(), date: v.string() },
  returns: v.id("dailyEntries"),
  handler: async (ctx, { text, date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const identityToken = identity.tokenIdentifier;

    // Check if an entry already exists for this date and user
    const existing = await ctx.db
      .query("dailyEntries")
      .withIndex("by_user_and_date", (q) =>
        q.eq("user", identityToken).eq("date", date),
      )
      .unique();

    if (existing) {
      // Update existing entry
      await ctx.db.patch(existing._id, { text });
      return existing._id;
    } else {
      // Create new entry
      const entryId = await ctx.db.insert("dailyEntries", {
        text,
        date,
        user: identityToken,
      });
      return entryId;
    }
  },
});
