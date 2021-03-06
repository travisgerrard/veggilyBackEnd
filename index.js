import 'dotenv/config';
import { Keystone } from '@keystonejs/keystone';
import Auth from '@keystonejs/auth-password';
import { GraphQLApp } from '@keystonejs/app-graphql';
import { AdminUIApp } from '@keystonejs/app-admin-ui';
import { MongooseAdapter as Adapter } from '@keystonejs/adapter-mongoose';
import expressSession from 'express-session';
import MongoStoreMaker from 'connect-mongo';

// import { createItems } from '@keystonejs/server-side-graphql-client';

import User from './models/User';
import Meal from './models/Meal';
import Ingredient from './models/Ingredient';
import Amount from './models/Amount';
import MealIngredientList from './models/MealIngredientList';
import GroceryList from './models/GroceryList';
import MealList from './models/MealList';
import MadeMeal from './models/MadeMeal';
import * as mutations from './mutations';

const MongoStore = MongoStoreMaker(expressSession);

const PROJECT_NAME = 'veggily';
console.log('TRYING TO CONNECT TO THE DB', process.env.DATABASE);

const adapterConfig = { mongoUri: process.env.DATABASE };

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  cookie: { secure: false },
  cookieSecret: 'travisgerrard',
  sessionStore: new MongoStore({ url: process.env.DATABASE }),

  // onConnect: async (keystone) => {
  //   await createItems({
  //     keystone,
  //     listKey: 'User',
  //     items: [
  //       {
  //         data: {
  //           name: 'travisgerrard',
  //           email: 'travisgerrard@gmail.com',
  //           password: 'travisgerrard@gmail.com',
  //         },
  //       },
  //     ],
  //   });
  // },
});

keystone.createList('User', User);
keystone.createList('Meal', Meal);
keystone.createList('MealIngredientList', MealIngredientList);
keystone.createList('Ingredient', Ingredient);
keystone.createList('Amount', Amount);
keystone.createList('GroceryList', GroceryList);
keystone.createList('MealList', MealList);
keystone.createList('MadeMeal', MadeMeal);

const authStrategy = keystone.createAuthStrategy({
  type: Auth.PasswordAuthStrategy,
  list: 'User',
});

keystone.extendGraphQLSchema({
  types: [{ type: 'type Message { message: String }' }],
  queries: [
    // {
    //   schema: 'me: User',
    //   resolver(parent, args, ctx, info) {
    //     return ctx.authedItem;
    //   },
    // },
  ],
  mutations: [
    {
      schema:
        'addMealIngredientList(id: ID!, ingredient: String!, amount: String!): MealIngredientList',
      resolver: mutations.addMealIngredientList,
    },
    {
      schema:
        'addGroceryList(ingredient: String!, amount: String!, mealId: ID): GroceryList',
      resolver: mutations.addGroceryList,
    },
    {
      schema: 'addMealToGroceryList(mealId: ID!): GroceryList',
      resolver: mutations.addMealToGroceryList,
    },
  ],
});

// module.exports = {
//   keystone,
//   apps: [
//     new GraphQLApp(),
//     new AdminUIApp({
//       name: PROJECT_NAME,
//       enableDefaultRoute: true,
//       authStrategy,
//     }),
//   ],
// };

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({ authStrategy, enableDefaultRoute: true }),
  ],
  configureExpress: (app) => {
    app.set('trust proxy', true);
  },
};
