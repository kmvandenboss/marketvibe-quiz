// sanity.config.ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  name: 'marketvibe',
  title: 'MarketVibe CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Articles')
              .child(
                S.documentTypeList('article')
                  .title('Articles')
                  .filter('_type == "article"')
              ),
            S.listItem()
              .title('Quiz References')
              .child(
                S.documentTypeList('quizReference')
                  .title('Quiz References')
                  .filter('_type == "quizReference"')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => 
                !['article', 'quizReference'].includes(listItem.getId()!)
            ),
          ])
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})