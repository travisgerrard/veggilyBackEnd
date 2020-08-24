import { Text, Relationship, Checkbox, CalendarDay } from "@keystonejs/fields";

export default {
  fields: {
    meal: { type: Relationship, ref: "Meal", many: false },
    author: { type: Relationship, ref: "User.madeMeals", many: false },
    thoughts: { type: Text, isMultiline: true },
    dateMade: {
      type: CalendarDay,
      dateFrom: '2001-01-16',
      dateTo: '2090-05-20',
    },
    like: { type: Checkbox },
  },
};
