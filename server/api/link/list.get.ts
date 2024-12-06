import { z } from 'zod'

export default eventHandler(async (event) => {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  if (!KV) {
    console.error("KV Store not initialized.");
    return { error: "KV Store not available." };
  }
  try {
  const { limit, cursor } = await getValidatedQuery(event, z.object({
    limit: z.coerce.number().max(1024).default(20),
    cursor: z.string().trim().max(1024).optional(),
  }).parse)
  const list = await KV.list({
    prefix: `link:`,
    limit,
    cursor,
  })
  if (Array.isArray(list.keys)) {
    list.links = await Promise.all(list.keys.map(async (key: { name: string }) => {
      const { metadata, value: link } = await KV.getWithMetadata(key.name, { type: 'json' })
      if (link) {
        return {
          ...metadata,
          ...link,
        }
      }
      return link
    }))
  }
  delete list.keys
    return list
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "Internal Server Error" };
  }
})
