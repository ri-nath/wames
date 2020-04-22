import { adjectives, animals, Config, uniqueNamesGenerator } from 'unique-names-generator';

import { User } from '../ts';
import DB from './DB';

export function generateUsername(callback: (username: string) => void) {
    let username = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'capital',
        length: 2
    });

    DB.users.find({
        username: username,
    }).then((docs: User[]) => {
        if (docs.length > 0) {
            generateUsername(callback);
        } else {
            callback(username);
        }
    });
};

export function registerUser(user_id: string, callback: (res: User | Error) => void) {
    DB.users.find({
        user_id: user_id
    })
        .then(docs => {
            if (docs.length > 0) {
                callback(docs[0]);
            } else {
                generateUsername(username => {
                    DB.users.insert({
                        user_id: user_id,
                        username: username,
                    })
                        .then(callback)
                        .catch(console.error);
                });
            }
        })
        .catch(console.error);
}

export function setUsername(user: User, callback: (res: User | Error) => void) {
    if (user.username === '') callback(Error("Username cannot be empty!"));

    DB.users.find({
        username: user.username
    })
        .then((docs: User[]) => {
            if (docs.length > 0) {
                callback(Error("Username is taken! " + docs[0].username))
            } else {
                DB.users.findOneAndUpdate(
                    {user_id: user.user_id},
                    {$set: {username: user.username}}
                )
                    .then(callback)
                    .catch(console.error);
            }
        })
        .catch(console.error);
}

export function getUserByName(username: string, callback: (user: User) => void) {
    DB.users.findOne({
        username: username
    })
        .then(callback)
        .catch(console.error);
}

export function getUsersByName(usernames: string[], callback: (users: User[]) => void) {
    if (usernames.length === 0) {
        console.log('getUsersByName called on empty array!');
        callback([]);
    }

    DB.users.find({
        $or: usernames.reduce((acc: Partial<User>[], cur: string) => {
            acc.push({
                username: cur
            });

            return acc;
        }, [])
    })
        .then(callback)
        .catch(console.error);
}