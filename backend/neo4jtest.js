require('dotenv').config();

(async() => {
    const neo4j = require('neo4j-driver');

    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USERNAME;
    const password = process.env.NEO4J_PASSWORD;
    
    // To learn more about the driver: https://neo4j.com/docs/javascript-manual/current/client-applications/#js-driver-driver-object
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    try {
        // await getAllBooks();
        // await getPopularBooks();
        // await getUserBooks('LovelyDesigner');
        // await getBookById('0156027321');
        // await rateBook('PerkySkylight55', '0195153448', 8);
        // await changeBookRating('PerkySkylight55', '0195153448', 10);
        await deleteBookRating('PerkySkylight55', '0195153448');

    } catch (error) {
        console.error(`Something went wrong: ${error}`);
    } finally {
        // Don't forget to close the driver connection when you're finished with it.
        await driver.close();
    }

    async function getAllBooks() {
        const session = driver.session({ database: 'neo4j' });
        let books = [];
        try {
            const query = `MATCH(u:User)-[r:RATED]->(b:Book) return b, count(u) as numOfRatings, 
            round(avg(r.value), 2) as averageRating`;

            const result = await session.executeRead((tx) => tx.run(query));

            result.records.forEach((record) => {
            books.push({ ...record.get('b').properties,          
            numOfRatings: record.get('numOfRatings'),
            rating: record.get('averageRating') });

            });
        } catch (error) {
            console.error(`Something went wrong: ${error}`);
        } finally {
            await session.close();
        }
    }

    async function getPopularBooks() {
        const session = driver.session({ database: 'neo4j' });
        let books = [];
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
        }
      }

      async function getUserBooks(username) {
        const session = driver.session({ database: 'neo4j' });
        let books = [];
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
        //   return books;
        }
      }

      async function getBookById(ISBN) {
        const session = driver.session({ database: 'neo4j' });
        let book = null;
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

      async function rateBook(username, ISBN, rating) {
        const session = driver.session({ database: 'neo4j' });
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
        
            const result = await session.executeWrite((tx) =>
                tx.run(query, { username, ISBN, rating })
            );
        
            const record = result.records[0];
            const res = {
                ...record.get('u').properties,
                ...record.get('r').properties,
                ...record.get('b').properties
            };
            } catch (error) {
            console.error(`Something went wrong: ${error}`);
            } finally {
            await session.close();
            }
      }

      async function changeBookRating(
        username,
        ISBN,
        rating
      ) {
        const session = driver.session({ database: 'neo4j' });
        try {
          const query = `
          MATCH (u:User {username: $username})-[r:RATED]->(b:Book { ISBN: $ISBN })
          SET r.value = $rating
          RETURN r`;
    
          await session.executeWrite((tx) =>
            tx.run(query, { username, ISBN, rating })
          );
        } catch (error) {
          console.error(`Something went wrong: ${error}`);
        } finally {
          await session.close();
        }
      }

      async function deleteBookRating(username, ISBN) {
        const session = driver.session({ database: 'neo4j' });
        try {
          const query = `
          MATCH (u:User {username: $username})-[r:RATED]->(b:Book {ISBN: $ISBN})
          DELETE r`;
    
          await session.executeWrite((tx) => tx.run(query, { username, ISBN }));
        } catch (error) {
          console.error(`Something went wrong: ${error}`);
        } finally {
          await session.close();
        }
      }
})();
