import { Relationship } from "@keystonejs/fields";

  export default {
    fields: {
        ingredient: { type: Relationship, ref: "Ingredient", many: false },
        amount: { type: Relationship, ref: "Amount", many: false },
        meal: { type: Relationship, ref: "Meal.ingredientList", many: true}
      },
  }