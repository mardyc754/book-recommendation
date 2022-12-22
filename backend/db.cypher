CREATE CONSTRAINT `imp_uniq_Book_ISBN` IF NOT EXISTS
FOR (n: `Book`)
REQUIRE (n.`ISBN`) IS UNIQUE;

UNWIND $nodeRecords AS nodeRecord
WITH *
WHERE NOT nodeRecord.`ISBN` IN $idsToSkip AND NOT nodeRecord.`ISBN` IS NULL
MERGE (n: `Book` { `ISBN`: nodeRecord.`ISBN` })
SET n.`title` = nodeRecord.`Book-Title`
SET n.`author` = nodeRecord.`Book-Author`
SET n.`year` = toInteger(trim(nodeRecord.`Year-Of-Publication`))
SET n.`publisher` = nodeRecord.`Publisher`
SET n.`Image-URL-L` = nodeRecord.`Image-URL-L`;

CREATE CONSTRAINT `imp_uniq_User_id` IF NOT EXISTS
FOR (n: `User`)
REQUIRE (n.`id`) IS UNIQUE;

UNWIND $nodeRecords AS nodeRecord
WITH *
WHERE NOT nodeRecord.`User-ID` IN $idsToSkip AND NOT toInteger(trim(nodeRecord.`User-ID`)) IS NULL
MERGE (n: `User` { `id`: toInteger(trim(nodeRecord.`User-ID`)) })
SET n.`username` = nodeRecord.`username`
SET n.`password` = nodeRecord.`password`;


UNWIND $relRecords AS relRecord
MATCH (source: `User` { `id`: toInteger(trim(relRecord.`User-ID`)) })
MATCH (target: `Book` { `ISBN`: relRecord.`ISBN` })
MERGE (source)-[r: `RATED`]->(target)
SET r.`value` = toInteger(trim(relRecord.`Book-Rating`));
