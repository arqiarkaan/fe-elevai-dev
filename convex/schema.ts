import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    username: v.string(),
    tokenBalance: v.optional(v.number()),
    subscriptionId: v.optional(v.string()),
    endsOn: v.optional(v.number()),
  }).index('by_userId', ['userId']),
});
