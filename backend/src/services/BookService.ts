import getSession from '../db';
import { Book, BookDetails, Rating } from '../types';

export default class BookService {
  public async getAllBooks(): Promise<Book[]> {
    const session = getSession();
    let books: BookDetails[] = [];
    try {
      const query = `MATCH (b:Book) 
      MATCH(u:User)-[r:RATED]->(b) return b, count(u) as numOfRatings, 
            round(avg(r.value), 2) as averageRating
      UNION
      MATCH (b:Book) WHERE NOT EXISTS((:User)-[:RATED]->(b)) return b, 0 as numOfRatings, 
            0 as averageRating`;

      const result = await session.executeRead((tx) => tx.run(query));

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties,
          numOfRatings:
            record.get('numOfRatings').low ?? record.get('numOfRatings'),
          rating: record.get('averageRating').low ?? record.get('averageRating')
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
      const query = `MATCH (b:Book) 
      MATCH(u:User)-[r:RATED]->(b) return b, count(u) as numOfRatings, 
            round(avg(r.value), 2) as averageRating ORDER by numOfRatings desc
      UNION
      MATCH (b:Book) WHERE NOT EXISTS((:User)-[:RATED]->(b)) return b, 0 as numOfRatings, 
            0 as averageRating
                     ORDER by numOfRatings desc`;

      const result = await session.executeRead((tx) => tx.run(query));

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties,
          numOfRatings:
            record.get('numOfRatings').low ?? record.get('numOfRatings'),
          rating: record.get('averageRating').low ?? record.get('averageRating')
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
      const query = `MATCH (b:Book) 
      MATCH(u:User)-[r:RATED]->(b) return b, count(u) as numOfRatings, 
            round(avg(r.value), 2) as averageRating ORDER by averageRating desc
      UNION
      MATCH (b:Book) WHERE NOT EXISTS((:User)-[:RATED]->(b)) return b, 0 as numOfRatings, 
            0 as averageRating
                     ORDER by averageRating desc`;

      const result = await session.executeRead((tx) => tx.run(query));

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties,
          numOfRatings:
            record.get('numOfRatings').low ?? record.get('numOfRatings'),
          rating: record.get('averageRating').low ?? record.get('averageRating')
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
          numOfRatings:
            record.get('numOfRatings').low ?? record.get('numOfRatings'),
          rating:
            record.get('averageRating').low ?? record.get('averageRating'),
          userRating: record.get('userRating').low ?? record.get('userRating')
        });
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return books;
    }
  }

  public async getRecommendedBooks(username: string) {
    const session = getSession();
    let books: Book[] = [];
    try {
      const query = `
      MATCH (u1:User { username: $username })
      MATCH (u1)-[r:RATED]->(b:Book)
      WITH u1, avg(r.value) AS u1_mean

      MATCH (u1)-[r1:RATED]->(b:Book)<-[r2:RATED]-(u2)
      WITH u1, u1_mean, u2, collect({r1: r1.value, r2: r2.value}) AS ratings WHERE size(ratings) > 1

      MATCH (u2)-[r:RATED]->(b:Book)
      WITH u1, u1_mean, u2, avg(r.value) AS u2_mean, ratings

      UNWIND ratings AS r

      WITH u1, u2, sum( (r.r1-u1_mean) * (r.r2-u2_mean) ) AS nominator,
              sqrt( sum( (r.r1 - u1_mean)^2) * sum( (r.r2 - u2_mean) ^2)) AS denominator
              WHERE denominator <> 0

      WITH u1, u2, nominator/denominator AS pearson

      ORDER BY pearson DESC

      MATCH (u2)-[r:RATED]->(b:Book) WHERE NOT EXISTS( (u1)-[:RATED]->(b) )

      WITH b, SUM( pearson * r.value)/SUM(pearson) AS score
      ORDER BY score DESC

      MATCH (u:User)-[r:RATED]->(b) return b, count(u) as numOfRatings, 
            round(avg(r.value), 2) as averageRating
      `;

      const result = await session.executeRead((tx) =>
        tx.run(query, { username })
      );

      result.records.forEach((record) => {
        books.push({
          ...record.get('b').properties,
          numOfRatings:
            record.get('numOfRatings').low ?? record.get('numOfRatings'),
          rating: record.get('averageRating').low ?? record.get('averageRating')
        });
      });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return books;
    }
  }

  public async getBookById(ISBN: string): Promise<BookDetails | null> {
    const session = getSession();
    let book: BookDetails | null = null;
    try {
      let query = `MATCH(u:User)-[r:RATED]->(b:Book { ISBN: $ISBN }) return b, count(u) as numOfRatings, 
        round(avg(r.value), 2) as averageRating`;

      let result = await session.executeRead((tx) => tx.run(query, { ISBN }));

      let record = result.records[0];

      if (!record) {
        query = `MATCH (b:Book { ISBN: $ISBN }) return b, 0 as numOfRatings, 
        0 as averageRating`;
        result = await session.executeRead((tx) => tx.run(query, { ISBN }));

        record = result.records[0];
      }

      book = {
        ...record.get('b').properties,
        numOfRatings:
          record.get('numOfRatings').low ?? record.get('numOfRatings'),
        rating: record.get('averageRating').low ?? record.get('averageRating')
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
            value: null,
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
    value: number
  ): Promise<boolean> {
    const session = getSession();
    let saved = false;
    try {
      const checkIfRatingExistsQuery = `MATCH(u:User { username: $username })-[r:RATED]->(b:Book {ISBN: $ISBN}) return r`;

      const exisitingRatings = await session.executeRead((tx) =>
        tx.run(checkIfRatingExistsQuery, { username, ISBN })
      );
      // zmie?? ocen??
      let query = `
      MATCH (u:User {username: $username})-[r:RATED]->(b:Book { ISBN: $ISBN })
      SET r.value = $value
      RETURN r`;
      // utw??rz now??
      if (exisitingRatings.records.length === 0) {
        query = `MATCH (u:User {username: $username })
        MATCH (b:Book {ISBN: $ISBN })
        CREATE (u)-[r:RATED]->(b)
        SET r.value = $value
        return u, b, r`;
      }

      await session
        .executeWrite((tx) => tx.run(query, { username, ISBN, value }))
        .then(() => {
          saved = true;
        });
    } catch (error) {
      console.error(`Something went wrong: ${error}`);
    } finally {
      await session.close();
      return saved;
    }
  }

  // public async changeBookRating(
  //   username: string,
  //   ISBN: string,
  //   rating: number
  // ): Promise<boolean> {
  //   const session = getSession();
  //   let saved = false;
  //   try {
  //     const query = `
  //     MATCH (u:User {username: $username})-[r:RATED]->(b:Book { ISBN: $ISBN })
  //     SET r.value = $rating
  //     RETURN r`;

  //     await session.executeWrite((tx) =>
  //       tx.run(query, { username, ISBN, rating })
  //     );
  //     saved = true;
  //   } catch (error) {
  //     console.error(`Something went wrong: ${error}`);
  //   } finally {
  //     await session.close();
  //     return saved;
  //   }
  // }

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
