import { MutationResolvers } from 'schema/types';
import { UndoneTodoInteractor } from 'domain-model/src/usecase/todo/UndoneTodo';

import { ApolloServerContext } from '../../../type';
import { TodoRepository } from '../../../../../repository/typeorm/Todo';
import { UndoneTodoPresenter } from '../../../../../presenter/todo/UndoneTodo';

export const undoneTodo: MutationResolvers<ApolloServerContext> = {
  undoneTodo: async (_parent, args, { dbConnection }) => {
    const repository = new TodoRepository(dbConnection);
    const presenter = new UndoneTodoPresenter();
    const usecase = new UndoneTodoInteractor(repository, presenter);

    await usecase.handle(args.input!);

    return presenter.getResponse()!;
  },
};
