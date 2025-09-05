// src/sanity/schemas/objects/callToAction.ts
import { defineField, defineType } from 'sanity'
import { BulbOutlineIcon } from '@sanity/icons'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonAction',
      title: 'Button Action',
      type: 'string',
      options: {
        list: [
          { title: 'Scroll to Quiz', value: 'scrollToQuiz' },
          { title: 'External Link', value: 'externalLink' },
          { title: 'Internal Link', value: 'internalLink' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      hidden: ({ parent }) => parent?.buttonAction === 'scrollToQuiz',
      validation: (Rule) =>
        Rule.custom((url, context) => {
          const buttonAction = (context.parent as any)?.buttonAction
          if (buttonAction !== 'scrollToQuiz' && !url) {
            return 'URL is required for external and internal links'
          }
          return true
        }),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Green)', value: 'primary' },
          { title: 'Secondary (Gray)', value: 'secondary' },
          { title: 'Outline', value: 'outline' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Light Green', value: 'lightGreen' },
          { title: 'Light Blue', value: 'lightBlue' },
          { title: 'Light Gray', value: 'lightGray' },
          { title: 'None', value: 'none' },
        ],
      },
      initialValue: 'lightGreen',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      buttonText: 'buttonText',
    },
    prepare(selection) {
      const { title, buttonText } = selection
      return {
        title: title,
        subtitle: `Button: ${buttonText}`,
        media: BulbOutlineIcon,
      }
    },
  },
})