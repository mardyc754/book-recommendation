import getSession from '../db';
import { User, AuthUser } from '../types';

export default class UserService {
  public async getUserByUsername(username: string): Promise<AuthUser | null> {
    const session = getSession();
    let user: AuthUser | null = null;
    try {
      const query =
        'MATCH(u:User { username: $username }) RETURN u.id, u.username, u.password';

      const result = await session.executeRead((tx) =>
        tx.run(query, { username })
      );

      const userRecord = result.records[0];
      user = {
        id: userRecord.get('u.id'),
        username: userRecord.get('u.username'),
        password: userRecord.get('u.password')
      };
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return user;
    }
  }

  public async getUserById(id: number): Promise<User | null> {
    const session = getSession();
    let user: User | null = null;
    try {
      const query =
        'MATCH(u:User { id: $id }) RETURN u.id, u.username, u.password';

      const result = await session.executeRead((tx) => tx.run(query, { id }));

      const userRecord = result.records[0];
      user = {
        id: userRecord.get('u.id'),
        username: userRecord.get('u.username')
      };
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return user;
    }
  }

  public async getAllUsers(): Promise<User[] | null> {
    const session = getSession();
    const users: User[] = [];
    try {
      const query = 'MATCH(u:User) RETURN u.id, u.username, u.password';
      const result = await session.executeRead((tx) => tx.run(query));

      result.records.forEach((record) => {
        users.push({
          id: record.get('u.id'),
          username: record.get('u.username')
        });
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return users;
    }
  }

  public async createUser(
    username: string,
    password: string
  ): Promise<AuthUser | null> {
    const session = getSession();
    let user: AuthUser | null = null;
    try {
      const query = `MATCH (last:User)
         WITH last ORDER BY last.id DESC LIMIT 1
         CREATE (u:User { id: last.id+1, username: $username, password: $password }) RETURN u.id, u.username, u.password`;

      const result = await session.executeWrite((tx) =>
        tx.run(query, { username, password })
      );

      const userRecord = result.records[0];
      user = {
        id: userRecord.get('u.id'),
        username: userRecord.get('u.username'),
        password: userRecord.get('u.password')
      };
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return user;
    }
  }
}
