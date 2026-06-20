import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alternative text' }],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter handle',
      type: 'string',
      description: 'Without the @',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'avatar' },
  },
})
