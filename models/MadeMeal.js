import { Text, Relationship, Checkbox, CalendarDay } from '@keystonejs/fields';
import { CloudinaryImage } from '@keystonejs/fields-cloudinary-image';
import { CloudinaryAdapter } from '@keystonejs/file-adapters';

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'veggily',
});

export default {
  fields: {
    meal: { type: Relationship, ref: 'Meal', many: false },
    author: { type: Relationship, ref: 'User.madeMeals', many: false },
    thoughts: { type: Text, isMultiline: true },
    dateMade: {
      type: CalendarDay,
      dateFrom: '2001-01-16',
      dateTo: '2090-05-20',
    },
    like: { type: Checkbox },
    ingredientImage: {
      type: CloudinaryImage,
      adapter: cloudinaryAdapter,
    },
  },
};
