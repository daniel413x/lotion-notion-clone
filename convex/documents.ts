import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

export const archive = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    const targetDocument = await ctx.db.get(args.id);
    if (!targetDocument) {
      throw new Error('Not found');
    }
    if (targetDocument.userId !== userId) {
      throw new Error('Unauthorized');
    }
    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => (
          q
            .eq('userId', userId)
            .eq('parentDocument', documentId)
        ))
        .collect();
      await Promise.all(children.map(async (child) => {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchive(child._id);
      }));
    };
    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    recursiveArchive(args.id);
    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) => (
        q
          .eq('userId', userId)
          .eq('parentDocument', args.parentDocument)))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();
    return documents;
  },
});

export const getArchived = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q
        .eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect();
    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});

export const update = mutation({
  args: {
    title: v.string(),
    id: v.id('documents'),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    const { id, ...props } = args;
    const targetDocument = await ctx.db.get(args.id);
    if (!targetDocument) {
      throw new Error('Not found');
    }
    if (targetDocument.userId !== userId) {
      throw new Error('Unauthorized');
    }
    const document = await ctx.db.patch(args.id, props);
    return document;
  },
});

export const restore = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    const targetDocument = await ctx.db.get(args.id);
    if (!targetDocument) {
      throw new Error('Not found');
    }
    if (targetDocument.userId !== userId) {
      throw new Error('Unauthorized');
    }
    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => (
          q
            .eq('userId', userId)
            .eq('parentDocument', documentId)
        ))
        .collect();
      Promise.all(children.map(async (c) => {
        await ctx.db.patch(c._id, {
          isArchived: false,
        });
        await recursiveRestore(c._id);
      }));
    };
    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    };
    if (targetDocument.parentDocument) {
      const parent = await ctx.db.get(targetDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }
    const document = await ctx.db.patch(args.id, options);
    await recursiveRestore(args.id);
    return document;
  },
});

export const remove = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    const targetDocument = await ctx.db.get(args.id);
    if (!targetDocument) {
      throw new Error('Not found');
    }
    if (targetDocument.userId !== userId) {
      throw new Error('Unauthorized');
    }
    const document = await ctx.db.delete(args.id);
    return document;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();
    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error('Not found');
    }
    if (document.isPublished && !document.isArchived) {
      return document;
    }
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    if (document.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return document;
  },
});
