import { v } from 'convex/values';
import { GenericMutationCtx, GenericQueryCtx, UserIdentity } from 'convex/server';
import { Doc, Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

const getIdentity = async (ctx: GenericMutationCtx<any> | GenericQueryCtx<any>) => {
  const identity: UserIdentity | null = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error('Not authenticated');
  }
  return identity;
};

const getDocumentAndVerifyOwnership = async (ctx: GenericMutationCtx<any> | GenericQueryCtx<any>, id: Id<'documents'>, identity: UserIdentity) => {
  const targetDocument = await ctx.db.get(id);
  if (!targetDocument) {
    throw new Error('Not found');
  }
  const userId = identity.subject;
  if (targetDocument.userId !== userId) {
    throw new Error('Unauthorized');
  }
  return targetDocument;
};

export const archive = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await getIdentity(ctx);
    const userId = identity.subject;
    await getDocumentAndVerifyOwnership(ctx, args.id, identity);
    const recursiveArchive = async (docId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => (
          q
            .eq('userId', userId)
            .eq('parentDocument', docId)
        ))
        .collect();
      await Promise.all(children.map(async (child) => {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchive(child._id);
      }));
    };
    const doc = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    recursiveArchive(args.id);
    return doc;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await getIdentity(ctx);
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
    const identity = await getIdentity(ctx);
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
    const identity = await getIdentity(ctx);
    const userId = identity.subject;
    const doc = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return doc;
  },
});

export const update = mutation({
  args: {
    title: v.optional(v.string()),
    id: v.id('documents'),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await getIdentity(ctx);
    const { id, ...props } = args;
    await getDocumentAndVerifyOwnership(ctx, args.id, identity);
    const doc = await ctx.db.patch(args.id, props);
    return doc;
  },
});

export const removeIcon = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await getIdentity(ctx);
    await getDocumentAndVerifyOwnership(ctx, args.id, identity);
    const doc = await ctx.db.patch(args.id, {
      icon: undefined,
    });
    return doc;
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await getIdentity(ctx);
    await getDocumentAndVerifyOwnership(ctx, args.id, identity);
    const doc = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });
    return doc;
  },
});

export const restore = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await getIdentity(ctx);
    const targetDocument = await getDocumentAndVerifyOwnership(ctx, args.id, identity);
    const userId = identity.subject;
    const recursiveRestore = async (docId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => (
          q
            .eq('userId', userId)
            .eq('parentDocument', docId)
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
    const doc = await ctx.db.patch(args.id, options);
    await recursiveRestore(args.id);
    return doc;
  },
});

export const remove = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await getIdentity(ctx);
    await getDocumentAndVerifyOwnership(ctx, args.id, identity);
    const doc = await ctx.db.delete(args.id);
    return doc;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await getIdentity(ctx);
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
  args: { docId: v.id('documents'), metadata: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const doc = await ctx.db.get(args.docId);
    if (args.metadata) {
      return doc;
    }
    if (!doc) {
      throw new Error('Not found');
    }
    if (doc.isPublished && !doc.isArchived) {
      return doc;
    }
    if (!identity) {
      throw new Error('Not authenticated');
    }
    const userId = identity.subject;
    if (doc.userId !== userId) {
      throw new Error('Unauthorized');
    }
    return doc;
  },
});
