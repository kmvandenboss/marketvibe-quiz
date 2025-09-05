// src/sanity/schemas/objects/quizEmbed.ts
import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const quizEmbed = defineType({
  name: 'quizEmbed',
  title: 'Quiz Embed',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'quiz',
      title: 'Quiz',
      type: 'reference',
      to: [{ type: 'quizReference' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Optional title to display above the quiz',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Optional description to display above the quiz',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Take the Quiz',
    }),
    defineField({
      name: 'showScrollButton',
      title: 'Show Scroll to Quiz Button',
      type: 'boolean',
      initialValue: true,
      description: 'Show a button that scrolls to the quiz when clicked',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      quizTitle: 'quiz.title',
    },
    prepare(selection) {
      const { title, quizTitle } = selection
      return {
        title: title || 'Quiz Embed',
        subtitle: quizTitle ? `Quiz: ${quizTitle}` : 'No quiz selected',
        media: PlayIcon,
      }
    },
  },
})