import { Text, Relationship } from '@keystonejs/fields';
import { CloudinaryImage } from '@keystonejs/fields-cloudinary-image';
import { CloudinaryAdapter } from '@keystonejs/file-adapters';
const { atTracking } = require('@keystonejs/list-plugins');

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'veggily',
});

export default {
  fields: {
    mealImage: {
      type: CloudinaryImage,
      adapter: cloudinaryAdapter,
      isRequired: false,
    },
    name: { type: Text, isRequired: true },
    description: { type: Text, isRequired: true },

    author: { type: Relationship, ref: 'User.meals', many: false },
    ingredientList: {
      type: Relationship,
      ref: 'MealIngredientList.meal',
      many: true,
    },
  },
  plugins: [atTracking()],
};
