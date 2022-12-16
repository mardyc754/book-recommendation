import pandas as pd
import random
import string

if __name__ == '__main__':
    # dataset taken from: https://www.kaggle.com/datasets/arashnic/book-recommendation-dataset
    num_of_users = 1000

    users = pd.DataFrame({'User-ID': list(range(1, num_of_users + 1))})

    with open('./BookDataset/nounlist.txt') as nounfile:
        nouns = nounfile.readlines()

    with open('./BookDataset/adjectives.txt') as adjfile:
        adjectives = adjfile.readlines()

    usernames = [f'{random.choice(adjectives).title()}{random.choice(nouns).title()}{"".join(random.choices(string.digits, k=random.randint(0, 4)))}'
                 .replace('\n', '').replace('-', '') for _ in range(num_of_users)]

    passwords = [''.join(random.choices(
        [*string.ascii_letters, *string.digits], k=random.randint(6, 20))) for _ in range(num_of_users)]

    users.insert(len(users.columns), 'username', usernames)
    users.insert(len(users.columns), 'password', passwords)

    # users.to_csv('./data/Users.csv', index=False)
    ratings = pd.read_csv('./BookDataset/Ratings.csv')

    ratings_small = ratings.loc[ratings['User-ID'].isin(users['User-ID'])]

    top_rating_users = ratings_small['User-ID'].groupby(
        ratings['User-ID']).value_counts().nlargest(10)
    print(top_rating_users)

    top_rated_books = ratings_small['ISBN'].groupby(
        ratings['ISBN']).value_counts().nlargest(10)
    print(top_rated_books)

    # ratings_small.to_csv('./data/Ratings.csv', index=False)

    books = pd.read_csv('BookDataset/Books.csv', low_memory=False)

    books_small = books.loc[books['ISBN']
                            .isin(ratings_small['ISBN'])]

    # books_small.to_csv('./data/Books.csv', index=False)
