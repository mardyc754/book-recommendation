// wszystkie książki z bazy
// - GET `/books` - wszystkie książki
const booksAllQuery = `MATCH(b:Book) RETURN b`;
// Użytkownik po nazwie użytkownika i haśle
// - GET `/users/current-user`
const userById = `MATCH(u:User { username: "username", password: "password" }) RETURN u`;
// książka po id (ISBN)
// - GET `/books/id:książki` - strona dla jednej książki
const bookById = `MATCH(b:Book { ISBN: "aaa" }) RETURN b`;
// książki usera po jego Id
// - GET `/user/id:użytkownika` - wyświetlenie informacji o użytkowniku, jego zapisanych, ocenionych książkach
const userBooksByUserId = `MATCH(:User {id: 1})-[:RATED]->(b:Book) return b`;
// książki usera po jego username
// - GET `/user/id:użytkownika` - wyświetlenie informacji o użytkowniku, jego zapisanych, ocenionych książkach
const userBooksByUsername = `MATCH(:User {username: "PerkySkylight55"})-[:RATED]->(b:Book) return b`;
// - GET `/user/id:użytkownika` - wyświetlenie informacji o użytkowniku, jego zapisanych, ocenionych książkach
// książki usera po jego id
const booksRatedByUser = `MATCH(b:Book)<-[:RATED]-(:User {id: 1}) return b`;
// - GET `/user/id:użytkownika` - wyświetlenie informacji o użytkowniku, jego zapisanych, ocenionych książkach
// książki usera po jego Id z ocenami
const booksRatedByUserWithRatings = `MATCH(b:Book)<-[r:RATED]-(:User {id: 929}) return b, r.value;`;
// użytkownicy, którzy ocenili książkę o podanym id (ISBN)
// /books/id:książki
const bookRatings = `MATCH(u:User)-[r:RATED]->(:Book { ISBN:"0971880107"}) return u.username, r.value`;
// inni użytkownicy, którzy ocenili książki ocenione przez danego użytkownika (przydatne do rekomendacji)
const otherRatings = `MATCH (j:User {id: 254})-[:RATED]->(b:Book)<-[r:RATED]-(p:User) return p.username, b.ISBN, r.value`;
// pozostałe książki ocenione przez tych użytkowników
// tutaj nie wiem czy ze względu na własności bazy grafowej nie wystarczy:
// MATCH (j:User {id: 254})-[:RATED]->(userBook:Book)<-[:RATED]-(p:User)-[r:RATED]->(b:Book) return p.username, b.ISBN, r.value
const otherUserRatings = `MATCH (j:User {id: 254})-[:RATED]->(userBook:Book)<-[:RATED]-(p:User)-[r:RATED]->(b:Book) WHERE NOT b.ISBN IN userBook.ISBN return p.username, b.ISBN, r.value`;

// dla colaborative filtering - wszystkie oceny książek ocenione przez użytkowników o podobnych preferencjach co obecny
// MATCH (:User {id: 254})-[:RATED]->(:Book)<-[:RATED]-(otherUser:User)-[r:RATED]->(b:Book)<-[q:RATED]-(anotherUser:User) return b.ISBN, r.value

// Można się wzorować:
// MATCH (tom:Person {name: 'Tom Hanks'})-[:ACTED_IN]->(movie1:Movie)<-[:ACTED_IN]-(coActor:Person)-[:ACTED_IN]->(movie2:Movie)<-[:ACTED_IN]-(coCoActor:Person)
// WHERE tom <> coCoActor
// AND NOT (tom)-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(coCoActor)
// RETURN coCoActor.name

// skumulowane książki z ocenami danego użytkownie w tablice:
// MATCH (j:User {id: 254})-[:RATED]->(userBook:Book)<-[:RATED]-(p:User)-[r:RATED]->(b:Book) return p.username, collect(userBook.ISBN) as bookIds, collect(r.value) as ratings

// liczba ocen książki malejąco:
// MATCH (u:User)-[:RATED]->(b:Book) return b.ISBN, count(u) as numOfRatings ORDER by numOfRatings desc

// liczba ocen wystawionych przez użytkowników malejąco
// MATCH (u:User)-[:RATED]->(b:Book) return u.id, count(b) as numOfRatings ORDER by numOfRatings DESC

// tutaj pomijamy użytkowników bez ocen:
// MATCH (u:User)-[:RATED]->(b:Book) WITH u.id as userId, count(b) as numOfRatings WHERE numOfRatings > 0 RETURN userId, numOfRatings ORDER by numOfRatings desc

// idki użytkowników, którzy nic nie ocenili (jest ich 701):
// MATCH (u:User) WHERE NOT EXISTS((u)-[:RATED]->(:Book)) return u.id

// utworzenie usera
// CREATE (user:User {username: 'Mark', password: 'qwerty'}) RETURN user

// dodanie oceny
// MATCH (user:User {username: 'aaa'})
// MATCH (book:Book {ISBN: 'dasd'})
// CREATE (user)-[r:RATED]->(book)
// SET r.value = value
// return value

// zmiana oceny
// MATCH (u:User {username: 'Jennifer'}-[r:RATED]->(b:Book { ISBN: 'qqq' }))
// SET r.value = value
// RETURN r

// usunięcie oceny
// MATCH (u:User {username: 'Jennifer'})-[r:RATED]->(b:Bok {ISBN: 'qqq'})
// DELETE r
const bookFromRange = 'Match(b:Book) return apoc.agg.slice(b, 0, 2)';
