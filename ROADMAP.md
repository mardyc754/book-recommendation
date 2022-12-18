# Book Recommender roadmap

## Temat Projektu

System rekomendacji książek
Zrobić GUI

- znaleźć bazę książek gotową :white_check_mark:
- narobić użytkowników :white_check_mark:
- pooceniać książki :white_check_mark:
- rekomendować książki po ocenach
- znaleźć fajną platformę wdrożeniową

Dwa typy węzłów: osoba i obiekt rekomendowany

osoba: user
obiekt rekomendowany: książka

## I. Konfiguracja bazy

Dane wykorzystane w projekcie pobrano ze strony:
https://www.kaggle.com/datasets/arashnic/book-recommendation-dataset. Z bazy tej wybrano pierwszych 1000 użytkowników oraz ocenione przez nich książki. Otrzymany dataset zaimportowano do bazy neo4j.

## II. Backend

Backend zostanie napisany w NodeJS z wykorzystaniem frameworku ExpressJS oraz języka TypeScript. Będzie on przetwarzał dane wykorzystując grafową bazę danych Neo4J.

Komunikacja klient-serwer będzie się odbywać za pomocą REST. Zostaną utworzone poniższe endpointy:

- POST `/auth/register` - utwórz konto
- GET `/auth/login` - zaloguj się
- GET `/auth/logout` - wyloguj się
- GET `/books` - wszystkie książki
- GET `/books?page_size=x?index=x` - książki dla podanej strony
- GET `/books/popular?page_size=x?index=x` - najbardziej popularne książki
- GET `/books/recommended?page_size=x?index=x` - rekomendowane książki - jeśli nie ma połączeń, to najbardziej popularne są wyświetlane
- GET `/books/id:książki` - strona dla jednej książki
- POST `/books/id:książki/rate` - wysłanie oceny książki
- PUT `/books/id:książki/rate` - zmiana oceny książki
- DELETE `/books/id:książki/rate` - usunięcie oceny książki
- GET `/books/user/id:usera` - wyświetlenie informacji o użytkowniku, jego zapisanych, ocenionych książkach
- POST `/books/user/id:usera/save` - zapisanie książki (to po prostu wystawienie oceny 0)

### III Frontend

Tutaj pewnie Next.js jako że routingiem nie trzeba się tutaj za bardzo męczyć.
A poza tym chyba wszystko można w Next.js napisać i fajnie się to wdraża.

Strony będą takie:

- Logowanie
- Rejestracja
- Strona główna z listą książek
- Strona dla każdej z książek (z rozróżnieniem czy user ma ocenić czy nie)
- Profil użytkownika na którym może przeglądać swoje zapisane książki i zmieniać im oceny

Trochę roboty jest :sweat_smile: