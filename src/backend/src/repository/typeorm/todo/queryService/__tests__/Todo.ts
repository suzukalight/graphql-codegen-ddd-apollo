import { Role } from 'domain-model';
import addDays from 'date-fns/addDays';

import { GqlTodoRepository } from '../../repository/Todo';
import { GqlUserRepository } from '../../../user/repository/User';
import { SqliteDbConnection } from '../../../_testutils/connection';
import { RoleTypes } from '../../../../../../../domain-model/lib';
import { GqlTodoQueryService } from '../Todo';
import { Connection } from 'typeorm';

const seedAll = async (connection: Connection, date: Date) => {
  const userRepository = new GqlUserRepository(connection);
  const todoRepository = new GqlTodoRepository(connection);

  const actor = await userRepository.create({ email: 'aaa@bb.com' });
  actor.addRole(new Role(RoleTypes.Member));

  const creators = [1, 2, 3].map(async (value) => {
    await todoRepository.create({
      ownerId: actor.getId().toString(),
      title: `TODO #${value}`,
      dueDate: addDays(date, value),
    });
  });

  await Promise.all(creators);
};

describe('GqlTodoQueryService', () => {
  const sqliteDbConnection = new SqliteDbConnection();

  beforeAll(async () => {
    const connection = await sqliteDbConnection.connect();
    await seedAll(connection, new Date('2020-01-10'));
  });

  afterAll(async () => {
    await sqliteDbConnection.dispose();
  });

  test.each`
    dueDate         | length
    ${'2019-10-01'} | ${0}
    ${'2020-01-07'} | ${0}
    ${'2020-01-08'} | ${1}
    ${'2020-01-09'} | ${2}
    ${'2020-01-10'} | ${3}
    ${'2020-01-11'} | ${3}
    ${'2021-01-01'} | ${3}
  `(
    'OK: dueDate=$dueDateのとき、エンティティを$length件取得できた',
    async ({ dueDate, length }: { dueDate: string; length: number }) => {
      const connection = sqliteDbConnection.getConnection();
      if (!connection) throw new Error('cannot connect to test database.');

      const todoQueryService = new GqlTodoQueryService(connection);

      const result = await todoQueryService.allTodosWithDeadlineApproaching({
        dueDate: new Date(dueDate),
        daysBeforeWarning: 3,
      });

      expect(result.todos?.length).toBe(length);
    },
  );
});
