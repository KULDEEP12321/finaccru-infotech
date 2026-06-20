import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Finaccru CMS')
    .items([
      S.listItem()
        .id('blogs')
        .title('Blogs')
        .schemaType('article')
        .child(
          S.documentTypeList('article')
            .id('all-blogs')
            .title('All blogs')
            .filter('_type == "article"')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
            .initialValueTemplates([S.initialValueTemplateItem('article')]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== 'article',
      ),
    ])
