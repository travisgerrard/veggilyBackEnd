import { gql } from "apollo-server-express";

export async function addMealIngredientList(parent, args, context, info) {
//   1. Make sure they are signed in
    const { id: userId } = context.authedItem;
    if (!userId) {
      throw new Error("You must be signed in soooon");
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
    variables: { name: args.ingredient },
  });

  const [existingIngredient] = allIngredients;

  let ingredient;

  // 3. Check if that ingredient exists, and if so connect to meal, and if not, create it
  if (existingIngredient) {
    ingredient = existingIngredient;

    const {
      data: { updateIngredient },
    } = await context.executeGraphQL({
      query: gql`
        mutation ADD_MEAL_TO_INGREDIENT($mealId: ID!, $ingredientId: ID!) {
          updateIngredient(
            id: $ingredientId
            data: { meal: { connect: { id: $mealId } } }
          ) {
            id
          }
        }
      `,
      variables: { mealId: args.id, ingredientId: existingIngredient.id },
    });
  } else {
    const {
      data: { createIngredient },
    } = await context.executeGraphQL({
      query: gql`
        mutation CREATE_INGREDIENT_AND_ATTACH_TO_MEAL(
          $name: String
          $mealId: ID!
        ) {
          createIngredient(
            data: { name: $name, meal: { connect: { id: $mealId } } }
          ) {
            id
          }
        }
      `,
      variables: { mealId: args.id, name: args.ingredient },
    });
    ingredient = createIngredient;
  }

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
    variables: { name: args.amount },
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
      variables: { name: args.amount },
    });

    amount = createAmount;
  }

  console.log(ingredient);
  console.log(amount);

  //create meal ingredient list!
  const {
    data: { createMealIngredientList },
  } = await context.executeGraphQL({
    query: gql`
      mutation CREATE_MEAL_INGREDIENT_LIST_MUTATION(
        $mealId: ID!
        $ingredientId: ID!
        $amountId: ID!
      ) {
        createMealIngredientList(
          data: {
            ingredient: { connect: { id: $ingredientId } }
            amount: { connect: { id: $amountId } }
            meal: { connect: { id: $mealId } }
          }
        ) {
          id
        }
      }
    `,
    variables: {
      mealId: args.id,
      ingredientId: ingredient.id,
      amountId: amount.id,
    },
  });

  return createMealIngredientList;
}
