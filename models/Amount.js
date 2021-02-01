import { Text, Relationship } from '@keystonejs/fields';

const { atTracking } = require('@keystonejs/list-plugins');

export default {
  fields: {
    name: { type: Text, isUnique: true, isRequired: true },
    meal: { type: Relationship, ref: 'Meal', many: true },
  },
  plugins: [atTracking()],
};
