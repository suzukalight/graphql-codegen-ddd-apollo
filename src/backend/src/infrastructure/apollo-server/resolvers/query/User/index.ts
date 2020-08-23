import { QueryResolvers } from 'schema/types';

import { ApolloServerContext } from '../../../types';
import { user } from './user';

export const User: QueryResolvers<ApolloServerContext> = {
  ...user,
};
