import { Text, Password, Checkbox, Relationship,Select } from "@keystonejs/fields";
import { userIsAdmin, userCanAccessUsers } from "../utils/access";

export default {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
   
    },
    permissions: {
        type: Select,
        defaultValue: 'USER',
        options: ['ADMIN', 'EDITOR', 'USER'],
      },
    password: {
      type: Password,
    },
    meals: { type: Relationship, ref: "Meal.author", many: true },
    groceryList: { type: Relationship, ref: "GroceryList.author", many: true },
    madeMeals: {type: Relationship, ref: "MadeMeal.author", many: true}
  },

  access: {
    // anyone should be able to create a user (sign up)
    create: true,
    // only admins can see the list of users
    read: true,
    update: userCanAccessUsers,
    delete: userIsAdmin,
  },
};
