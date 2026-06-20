import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { apiVersion, dataset, projectId } from './sanity/env'
import { structure } from './sanity/studioStructure'

export default defineConfig({
  name: 'finaccru',
  title: 'Finaccru CMS',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
})
