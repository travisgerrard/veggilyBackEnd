import { Relationship, Checkbox, DateTime } from "@keystonejs/fields";

export default {
  fields: {
    meal: { type: Relationship, ref: "Meal", many: false },
    isCompleted: { type: Checkbox, defaultValue: false },
    dateCompleted: {
      type: DateTime,
      format: "dd/MM/yyyy HH:mm O",
      yearRangeFrom: 1901,
      yearRangeTo: 2018,
      yearPickerType: "auto",
    },
  },
};
