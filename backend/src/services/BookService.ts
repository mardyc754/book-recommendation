import getSession from '../db';
import { Book, BookDetails, Rating } from '../types';

export default class BookService {
  public async getAllBooks(): Promise<Book[]> {
    const session = getSession();
    let books: BookDetails[] = [];
    try {
      const query = `MATCH(u:User)-[r:RATED]->(b:Book) return b, count(u) as numOfRatings, 
      round(avg(r.value), 2) as averageRating LIMIT 20`;

      const result = await session.executeRead((tx) => tx.run(query));

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties,
          numOfRatings: record.get('numOfRatings'),
          rating: record.get('averageRating')
        });
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return books;
    }
  }

  public async getBooksForPage(page: number, limit: number): Promise<Book[]> {
    const session = getSession();
    let books: BookDetails[] = [];
    try {
      const query = `MATCH(u:User)-[r:RATED]->(b:Book) WHERE b.rowNumber > $page AND b.rowNumber < $page+$limit return b, count(u) as numOfRatings, 
      round(avg(r.value), 2) as averageRating`;

      const result = await session.executeRead((tx) =>
        tx.run(query, { page, limit })
      );

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties,
          numOfRatings: record.get('numOfRatings'),
          rating: record.get('averageRating')
        });
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return books;
    }
  }

  public async getNumberOfBooks(): Promise<number> {
    const session = getSession();
    let numOfBooks = 0;
    try {
      const query = `Match(b:Book) return count(b) as numOfBooks`;

      const result = await session.executeRead((tx) => tx.run(query));
      numOfBooks = result.records[0].get('numOfBooks').properties.low;
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return numOfBooks;
    }
  }

  public async getPopularBooks(): Promise<BookDetails[]> {
    const session = getSession();
    let books: BookDetails[] = [];
    try {
      const query = `MATCH (u:User)-[r:RATED]->(b:Book) 
                     return b, count(u) as numOfRatings, 
                     round(avg(r.value), 2) as averageRating 
                     ORDER by numOfRatings desc`;

      const result = await session.executeRead((tx) => tx.run(query));

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties,
          numOfRatings: record.get('numOfRatings'),
          rating: record.get('averageRating')
        });
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return books;
    }
  }

  public async getHighestRatedBooks(): Promise<BookDetails[]> {
    const session = getSession();
    let books: BookDetails[] = [];
    try {
      const query = `MATCH (u:User)-[r:RATED]->(b:Book) 
                     return b, count(u) as numOfRatings, 
                     round(avg(r.value), 2) as averageRating 
                     ORDER by averageRating desc`;

      const result = await session.executeRead((tx) => tx.run(query));

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties,
          numOfRatings: record.get('numOfRatings'),
          rating: record.get('averageRating')
        });
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return books;
    }
  }

  public async getUserBooks(username: string): Promise<Book[]> {
    const session = getSession();
    let books: Book[] = [];
    try {
      const query = `
      MATCH(u:User)-[r:RATED]->(book:Book) 
      WITH book as b, count(u) as numOfRatings, 
      round(avg(r.value), 2) as averageRating
      MATCH (u:User)-[r:RATED]->(b) WHERE EXISTS((u {username: $username })-[r]->(b)) 
      RETURN b, numOfRatings, averageRating, r.value as userRating`;

      const result = await session.executeRead((tx) =>
        tx.run(query, { username })
      );

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties,
          numOfRatings: record.get('numOfRatings'),
          rating: record.get('averageRating'),
          userRating: record.get('userRating')
        });
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return books;
    }
  }

  // TODO - cały sens projektu jest tutaj zawarty
  public getRecommendedBooks(username: string) {}

  public async getBookById(ISBN: string): Promise<BookDetails | null> {
    const session = getSession();
    let book: BookDetails | null = null;
    try {
      const query = `MATCH(u:User)-[r:RATED]->(b:Book { ISBN: $ISBN }) return b, count(u) as numOfRatings, 
        round(avg(r.value), 2) as averageRating`;

      const result = await session.executeRead((tx) => tx.run(query, { ISBN }));

      const record = result.records[0];
      book = {
        ...record.get('b').properties,
        numOfRatings: record.get('numOfRatings'),
        rating: record.get('averageRating')
      };
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return book;
    }
  }

  public async getBookByIdWithUserRating(
    ISBN: string,
    username: string
  ): Promise<BookDetails | null> {
    const session = getSession();
    let book: BookDetails | null = null;
    try {
      const query = `MATCH(u:User)-[r:RATED]->(book:Book) WITH book as b, count(u) as numOfRatings, 
          round(avg(r.value), 2) as averageRating
          MATCH (u:User)-[r:RATED]->(b) WHERE EXISTS((u {username: $username})-[r]->(b {ISBN: $ISBN})) 
          RETURN b, numOfRatings, averageRating, r.value as userRating`;

      const result = await session.executeRead((tx) =>
        tx.run(query, { username, ISBN })
      );

      const record = result.records[0];
      book = {
        ...record.get('b').properties,
        numOfRatings: record.get('numOfRatings'),
        rating: record.get('averageRating'),
        userRating: record.get('userRating')
      };
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return book;
    }
  }

  public async getBookUserRating(
    ISBN: string,
    username: string
  ): Promise<Rating | null> {
    const session = getSession();
    let rating: Rating | null = null;
    try {
      const query = `MATCH(u:User { username: $username })-[r:RATED]->(b:Book {ISBN: $ISBN }) return r.value as userRating, b.ISBN, u.username`;

      const result = await session.executeRead((tx) =>
        tx.run(query, { username, ISBN })
      );

      const record = result.records[0];
      rating = record
        ? {
            value: record.get('userRating'),
            ISBN: record.get('b.ISBN'),
            username: record.get('u.username')
          }
        : {
            value: 0,
            ISBN,
            username
          };
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return rating;
    }
  }

  public async rateBook(
    username: string,
    ISBN: string,
    rating: number
  ): Promise<boolean> {
    const session = getSession();
    let saved = false;
    try {
      const checkIfRatingExistsQuery = `MATCH(u:User { username: $username })-[r:RATED]->(b:Book {ISBN: $ISBN}) return r`;

      const exisitingRatings = await session.executeRead((tx) =>
        tx.run(checkIfRatingExistsQuery, { username, ISBN })
      );

      if (exisitingRatings.records.length > 0) {
        throw new Error('You have already rated this book');
      }

      const query = `MATCH (u:User {username: $username })
      MATCH (b:Book {ISBN: $ISBN })
      CREATE (u)-[r:RATED]->(b)
      SET r.value = $rating
      return u, b, r`;

      await session.executeWrite((tx) =>
        tx.run(query, { username, ISBN, rating })
      );
      saved = true;
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return saved;
    }
  }

  public async changeBookRating(
    username: string,
    ISBN: string,
    rating: number
  ): Promise<boolean> {
    const session = getSession();
    let saved = false;
    try {
      const query = `
      MATCH (u:User {username: $username})-[r:RATED]->(b:Book { ISBN: $ISBN })
      SET r.value = $rating
      RETURN r`;

      await session.executeWrite((tx) =>
        tx.run(query, { username, ISBN, rating })
      );
      saved = true;
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return saved;
    }
  }

  public async deleteBookRating(
    username: string,
    ISBN: string
  ): Promise<boolean> {
    const session = getSession();
    let saved = false;
    try {
      const query = `
      MATCH (u:User {username: $username})-[r:RATED]->(b:Book {ISBN: $ISBN})
      DELETE r`;

      await session.executeWrite((tx) => tx.run(query, { username, ISBN }));
      saved = true;
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return saved;
    }
  }
}
