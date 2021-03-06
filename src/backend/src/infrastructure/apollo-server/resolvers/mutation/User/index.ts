import { MutationResolvers } from 'schema';

import { ApolloServerContext } from '../../../types';
import { createUser } from './createUser';
import { deleteUser } from './deleteUser';
import { updateUserRoles } from './updateUserRoles';

export const User: MutationResolvers<ApolloServerContext> = {
  ...createUser,
  ...updateUserRoles,
  ...deleteUser,
};
