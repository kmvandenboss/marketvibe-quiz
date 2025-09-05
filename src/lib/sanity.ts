// src/lib/sanity.ts
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ queries
export const articlesQuery = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc)`

export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  content[]{
    ...,
    _type == "quizEmbed" => {
      ...,
      quiz->{
        _id,
        title,
        slug,
        description,
        isActive
      }
    }
  },
  featuredImage,
  publishedAt,
  seo,
  "estimatedReadingTime": round(length(pt::text(content)) / 5 / 180 )
}`

export const articleSlugsQuery = `*[_type == "article" && defined(slug.current)].slug.current`

export async function getArticles() {
  return await client.fetch(articlesQuery)
}

export async function getArticleBySlug(slug: string) {
  return await client.fetch(articleBySlugQuery, { slug })
}

export async function getArticleSlugs() {
  return await client.fetch(articleSlugsQuery)
}