// ./sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';
import { visionTool } from '@sanity/vision';
import { colorInput } from '@sanity/color-input';
import { structure } from './src/lib/sanity/structure';
import { singletonTools } from 'sanity-plugin-singleton-management';

export default defineConfig({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [structureTool({ structure }), visionTool(), colorInput(), singletonTools()],
  schema: {
    types: schemaTypes,
  },
});
