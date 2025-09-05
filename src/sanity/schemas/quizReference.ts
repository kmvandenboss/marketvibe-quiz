// src/sanity/schemas/quizReference.ts
import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const quizReference = defineType({
  name: 'quizReference',
  title: 'Quiz Reference',
  type: 'document',
  icon: PlayIcon,
  description: 'Reference to quizzes in your database for embedding in articles',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Quiz Slug',
      type: 'string',
      description: 'The slug of the quiz in your database (e.g., "high-yield-quiz")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, slug, isActive } = selection
      return {
        title,
        subtitle: `/${slug} ${!isActive ? '(Inactive)' : ''}`,
        media: PlayIcon,
      }
    },
  },
})