// src/sanity/schemas/objects/investmentOptions.ts
import { defineField, defineType } from 'sanity'
import { TrendUpwardIcon } from '@sanity/icons'

export const investmentOptions = defineType({
  name: 'investmentOptions',
  title: 'Investment Options Block',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Featured Investment Opportunities',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'List', value: 'list' },
          { title: 'Featured', value: 'featured' },
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'maxItems',
      title: 'Maximum Items to Show',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
    },
    prepare(selection) {
      const { title, layout } = selection
      return {
        title: title || 'Investment Options',
        subtitle: `Layout: ${layout}`,
        media: TrendUpwardIcon,
      }
    },
  },
})