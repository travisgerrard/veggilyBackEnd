import { gql } from 'apollo-server-express';

export async function addMealToGroceryList(parent, args, context, info) {
  const { id: userId } = context.authedItem;
  console.log(userId);
  if (!userId) {
    throw new Error('You must be signed in soooon');
  }

  const {
    data: { Meal },
  } = await context.executeGraphQL({
    query: gql`
      query SINGLE_MEAL_QUERY($id: ID!) {
        Meal(where: { id: $id }) {
          id
          name
          description
          mealImage {
            publicUrlTransformed
          }
          author {
            id
          }
          ingredientList {
            id
            ingredient {
              id
              name
            }
            amount {
              id
              name
            }
          }
        }
      }
    `,
    variables: { id: args.mealId },
  });

  const { ingredientList } = Meal;

  ingredientList.forEach(async (item) => {
    await context.executeGraphQL({
      query: gql`
        mutation ADD_GROCERY_LIST(
          $ingredient: String!
          $amount: String!
          $mealId: ID
        ) {
          addGroceryList(
            ingredient: $ingredient
            amount: $amount
            mealId: $mealId
          ) {
            id
          }
        }
      `,
      variables: {
        ingredient: item.ingredient.name,
        amount: item.amount.name,
        mealId: args.mealId,
      },
    });
  });

  return true;
}
