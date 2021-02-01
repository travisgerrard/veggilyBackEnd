import { Text, Relationship, Select } from '@keystonejs/fields';
import { userIsAdminOrOwner, userCanUpdateItem } from '../utils/access';
import { CloudinaryImage } from '@keystonejs/fields-cloudinary-image';
import { CloudinaryAdapter } from '@keystonejs/file-adapters';
const { atTracking } = require('@keystonejs/list-plugins');

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'veggily',
});

const options = [
  { value: 0, label: 'none' },
  { value: 1, label: 'produce' },
  { value: 2, label: 'bakery' },
  { value: 3, label: 'frozen' },
  { value: 4, label: 'baking & spices' },
  { value: 5, label: 'nuts, seeds & dried fruit' },
  { value: 6, label: 'rice, grains & beans' },
  { value: 7, label: 'canned & jarred goods' },
  { value: 8, label: 'oils, sauces & condiments' },
  { value: 9, label: 'ethnic' },
  { value: 10, label: 'refrigerated' },
];

export default {
  fields: {
    name: { type: Text, isUnique: true, isRequired: true },
    meal: { type: Relationship, ref: 'Meal', many: true },
    category: { type: Select, options, dataType: 'integer', defaultValue: 0 },
    ingredientImage: {
      type: CloudinaryImage,
      adapter: cloudinaryAdapter,
    },
  },
  plugins: [atTracking()],
};
