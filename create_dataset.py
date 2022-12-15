import numpy as np
import pandas as pd
import random
import string

# dataset taken from: https://www.kaggle.com/datasets/arashnic/book-recommendation-dataset
books_small = pd.read_csv('./BookDataset/Books.csv',
                          low_memory=False).sample(n=1000)

books_small.to_csv('./data/Books.csv', index=False)

ratings = pd.read_csv('./BookDataset/Ratings.csv')
ratings_small = ratings.loc[ratings['ISBN'].isin(books_small['ISBN'])]

ratings_small.to_csv('./data/Ratings.csv', index=False)

users = pd.read_csv('BookDataset/Users.csv')
users_small = users.loc[users['User-ID']
                        .isin(ratings_small['User-ID'])]

users_small.to_csv('./data/Users.csv', index=False)


with open('./nounlist.txt') as nounfile:
    nouns = nounfile.readlines()

with open('./adjectives.txt') as adjfile:
    adjectives = adjfile.readlines()

num_of_users = users_small.shape[0]

usernames = [f'\
{random.choice(adjectives).title()}\
{random.choice(nouns).title()}\
{"".join(random.choices(string.digits, k=random.randint(0, 4)))}'
             .replace('\n', '') for _ in range(num_of_users)]

passwords = [''.join(random.choices(
    [*string.ascii_letters, *string.digits], k=random.randint(6, 20))) for _ in range(num_of_users)]

users_small.insert(len(users_small.columns), 'username', usernames)
users_small.insert(len(users_small.columns), 'password', passwords)

with open('data/UsersExtraData.csv', 'w') as outfile:
    outfile.writelines(
        [f'{username},{password}\n' for username, password in zip(usernames, passwords)])

users_small.to_csv('./data/UsersFull.csv', index=False)
