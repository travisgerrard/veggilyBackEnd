import { Relationship, Checkbox, DateTime } from '@keystonejs/fields';

export default {
  fields: {
    ingredient: { type: Relationship, ref: 'Ingredient', many: false },
    amount: { type: Relationship, ref: 'Amount', many: false },
    author: { type: Relationship, ref: 'User.groceryList', many: false },
    meal: { type: Relationship, ref: 'Meal', many: false },
    isCompleted: { type: Checkbox, defaultValue: false },
    dateCompleted: {
      type: DateTime,
      format: 'dd/MM/yyyy HH:mm O',
      yearRangeFrom: 1901,
      yearRangeTo: 2018,
      yearPickerType: 'auto',
    },
  },
};
