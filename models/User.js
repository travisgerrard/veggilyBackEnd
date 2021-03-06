import {
  Text,
  Password,
  Checkbox,
  Relationship,
  Select,
} from '@keystonejs/fields';
import { userIsAdmin, userCanAccessUsers } from '../utils/access';
const { atTracking } = require('@keystonejs/list-plugins');

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
    meals: { type: Relationship, ref: 'Meal.author', many: true },
    groceryList: { type: Relationship, ref: 'GroceryList.author', many: true },
    mealList: { type: Relationship, ref: 'MealList.author', many: true },
    madeMeals: { type: Relationship, ref: 'MadeMeal.author', many: true },
    follows: { type: Relationship, ref: 'User.followers', many: true },
    followers: { type: Relationship, ref: 'User.follows', many: true },
  },
  plugins: [atTracking()],

  access: {
    // anyone should be able to create a user (sign up)
    create: true,
    // only admins can see the list of users
    read: true,
    update: userCanAccessUsers,
    delete: userIsAdmin,
  },
};
