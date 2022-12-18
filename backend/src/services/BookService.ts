import getSession from '../db';

export type Book = {
  ISBN: string;
  title: string;
  author: string;
  year: number;
  publisher: string;
  imageURL: string;
};

export type BookDetails = {
  numOfRatings: number;
  rating: number;
} & Book;

export default class BookService {
  // private static instance: BookService | undefined;

  // private constructor() {}

  // public static getInstance(): BookService {
  //   if (!BookService.instance) {
  //     BookService.instance = new BookService();
  //   }

  //   return BookService.instance;
  // }

  public async getAllBooks(): Promise<Book[]> {
    const session = getSession();
    let books: BookDetails[] = [];
    try {
      const query = `MATCH(u:User)-[r:RATED]->(b:Book) return b, count(u) as numOfRatings, 
      round(avg(r.value), 2) as averageRating`;

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
      const query = `MATCH(:User { username: $username })-[:RATED]->(b:Book) return b`;

      const result = await session.executeRead((tx) =>
        tx.run(query, { username })
      );

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties
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
      if (!record) throw new Error('Book by given id does not exist');

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
