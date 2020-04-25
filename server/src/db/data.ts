import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';

import { createError } from '../api';
import { Acknowledgement, Hesitant, User } from '../ts';
import DB from './DB';

function handle_error(error: Error, callback: Hesitant<any>) {
    console.error(error);

    callback(createError('FAILED', error.name + ': ' + error.message));
}

export function generateUsername(callback: (res: string) => void) {
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

export function registerUser(user_id: string, callback: Acknowledgement<User>) {
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
                        .catch(e => handle_error(e, callback));

                });
            }
        })
        .catch(e => handle_error(e, callback));

}

export function setUsername(user: User, callback: Acknowledgement<User>) {
    if (user.username === '') {
        callback(createError('REJECTED', 'Username cannot be empty!'));
    } else {
        DB.users.find({
            username: user.username
        })
            .then((docs: User[]) => {
                if (docs.length > 0) {
                    callback(createError('REJECTED', "Username is taken! " + docs[0].username))
                } else {
                    DB.users.findOneAndUpdate(
                        {user_id: user.user_id},
                        {$set: {username: user.username}}
                    )
                        .then(callback)
                        .catch(e => handle_error(e, callback));

                }
            })
            .catch(e => handle_error(e, callback));
    }

}

export function getUserByName(username: string, callback: Acknowledgement<User>) {
    DB.users.findOne({
        username: username
    })
        .then(callback)
        .catch(e => handle_error(e, callback));

}

export function getUsersByName(usernames: string[], callback: Acknowledgement<User[]>) {
    if (usernames.length === 0) {
        console.log('getUsersByName called on empty array!');
        callback([]);
    } else {
        DB.users.find({
            $or: usernames.reduce((acc: Partial<User>[], cur: string) => {
                acc.push({
                    username: cur
                });
                return acc;
            }, [])
        })
            .then(callback)
            .catch(e => handle_error(e, callback));
    }
}