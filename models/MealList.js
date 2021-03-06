import { Relationship, Checkbox, DateTime } from '@keystonejs/fields';
const { atTracking } = require('@keystonejs/list-plugins');

export default {
  fields: {
    meal: { type: Relationship, ref: 'Meal', many: false },
    author: { type: Relationship, ref: 'User.mealList', many: false },
    isCompleted: { type: Checkbox, defaultValue: false },
    dateCompleted: {
      type: DateTime,
      format: 'dd/MM/yyyy HH:mm O',
      yearRangeFrom: 1901,
      yearRangeTo: 2018,
      yearPickerType: 'auto',
    },
  },
  plugins: [atTracking()],
};
