import { Text } from "@keystonejs/fields";
import {
    userIsAdminOrOwner,
    userCanUpdateItem,
  } from '../utils/access';

  export default {
    fields: {
        name: { type: Text, isUnique: true, isRequired: true },
      },
      access: {
        create: true,
        read: true,
        update: userCanUpdateItem,
        delete: userIsAdminOrOwner,
      },
  }