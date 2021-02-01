import { gql } from 'apollo-server-express';

export async function addGroceryList(parent, args, context, info) {
  //   1. Make sure they are signed in

  const { id: userId } = context.authedItem;
  console.log(userId);
  if (!userId) {
    throw new Error('You must be signed in soooon');
  }

  args.ingredient = args.ingredient.toLowerCase().trim();
  args.amount = args.amount.toLowerCase().trim();

  // 2. Query to see if ingredient exsits already
  const {
    data: { allIngredients },
  } = await context.executeGraphQL({
    query: gql`
      query INGREDIENT_WITH_NAME($name: String) {
        allIngredients(where: { name: $name }) {
          id
        }
      }
    `,
    variables: {
      name: args.ingredient,
    },
  });

  const [existingIngredient] = allIngredients;

  let ingredient;

  // 3. Check if that ingredient exists and if not, create it
  if (existingIngredient) {
    ingredient = existingIngredient;
  } else {
    const {
      data: { createIngredient },
    } = await context.executeGraphQL({
      query: gql`
        mutation CREATE_INGREDIENT_AND_ATTACH_TO_MEAL($name: String) {
          createIngredient(data: { name: $name }) {
            id
          }
        }
      `,
      variables: {
        name: args.ingredient,
      },
    });
    ingredient = createIngredient;
  }

  console.log(ingredient);

  //4 Query to see if amount exsits already
  const {
    data: { allAmounts },
  } = await context.executeGraphQL({
    query: gql`
      query AMOUNT_WITH_NAME($name: String) {
        allAmounts(where: { name: $name }) {
          id
        }
      }
    `,
    variables: {
      name: args.amount,
    },
  });

  const [existingAmount] = allAmounts;
  let amount;

  // 5. Check if that amount exists and if not, create it
  if (existingAmount) {
    amount = existingAmount;
  } else {
    const {
      data: { createAmount },
    } = await context.executeGraphQL({
      query: gql`
        mutation CREATE_AMOUNT($name: String) {
          createAmount(data: { name: $name }) {
            id
          }
        }
      `,
      variables: {
        name: args.amount,
      },
    });

    amount = createAmount;
  }

  // create grocery list
  //create meal ingredient list!
  // check if mealId present, and if so add with respective meal
  if (args.mealId) {
    const {
      data: { createGroceryList },
    } = await context.executeGraphQL({
      query: gql`
        fragment IngredientFragment on Ingredient {
          id
          name
          category
        }

        fragment AmountFragment on Amount {
          id
          name
        }

        fragment GroceryListFragment on GroceryList {
          id
          author {
            id
          }
          ingredient {
            ...IngredientFragment
          }
          amount {
            ...AmountFragment
          }
          isCompleted
          dateCompleted
        }

        mutation CREATE_GROCERYLIST_MUTATION(
          $ingredientId: ID!
          $amountId: ID!
          $userId: ID!
          $mealId: ID
        ) {
          createGroceryList(
            data: {
              ingredient: { connect: { id: $ingredientId } }
              amount: { connect: { id: $amountId } }
              author: { connect: { id: $userId } }
              meal: { connect: { id: $mealId } }
            }
          ) {
            ...GroceryListFragment
          }
        }
      `,
      variables: {
        ingredientId: ingredient.id,
        amountId: amount.id,
        userId: userId,
        mealId: args.mealId,
      },
    });
    return createGroceryList;
  } else {
    const {
      data: { createGroceryList },
    } = await context.executeGraphQL({
      query: gql`
        fragment IngredientFragment on Ingredient {
          id
          name
          category
        }

        fragment AmountFragment on Amount {
          id
          name
        }

        fragment GroceryListFragment on GroceryList {
          id
          author {
            id
          }
          ingredient {
            ...IngredientFragment
          }
          amount {
            ...AmountFragment
          }
          isCompleted
          dateCompleted
        }

        mutation CREATE_GROCERYLIST_MUTATION(
          $ingredientId: ID!
          $amountId: ID!
          $userId: ID!
        ) {
          createGroceryList(
            data: {
              ingredient: { connect: { id: $ingredientId } }
              amount: { connect: { id: $amountId } }
              author: { connect: { id: $userId } }
            }
          ) {
            ...GroceryListFragment
          }
        }
      `,
      variables: {
        ingredientId: ingredient.id,
        amountId: amount.id,
        userId: userId,
      },
    });
    return createGroceryList;
  }
}
