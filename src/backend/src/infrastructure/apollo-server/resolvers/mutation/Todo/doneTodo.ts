import { MutationResolvers } from 'schema/types';
import { DoneTodoInteractor } from 'domain-model/src/usecase/todo/DoneTodo';

import { ApolloServerContext } from '../../type';
import { TodoRepository } from '../../../../../repository/typeorm/Todo';
import { DoneTodoPresenter } from '../../../../../presenter/todo/DoneTodo';

export const doneTodo: MutationResolvers<ApolloServerContext> = {
  doneTodo: async (_parent, args, { dbConnection }) => {
    const repository = new TodoRepository(dbConnection);
    const presenter = new DoneTodoPresenter();
    const usecase = new DoneTodoInteractor(repository, presenter);

    await usecase.handle(args.input!);

    return presenter.getResponse()!;
  },
};
