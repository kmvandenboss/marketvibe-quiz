// src/sanity/schemas/index.ts
import { article } from './article'
import { quizReference } from './quizReference'
import { quizEmbed } from './objects/quizEmbed'
import { investmentOptions } from './objects/investmentOptions'
import { callToAction } from './objects/callToAction'
import { seoMetadata } from './objects/seoMetadata'

export const schemaTypes = [
  // Documents
  article,
  quizReference,
  
  // Objects
  quizEmbed,
  investmentOptions,
  callToAction,
  seoMetadata,
]