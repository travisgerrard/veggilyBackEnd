import { Text, Relationship } from '@keystonejs/fields';
import { userIsAdminOrOwner, userCanUpdateItem } from '../utils/access';

export default {
  fields: {
    name: { type: Text, isUnique: true, isRequired: true },
    meal: { type: Relationship, ref: 'Meal', many: true },
  },
  // access: {
  //   create: true,
  //   read: true,
  //   update: userCanUpdateItem,
  //   delete: userIsAdminOrOwner,
  // },
};
