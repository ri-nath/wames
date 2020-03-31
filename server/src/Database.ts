import { AnagramObject, AnagramState, User } from '../types';

import monk, { IMonkManager, ICollection } from 'monk';
import { uniqueNamesGenerator, adjectives, animals, Config } from 'unique-names-generator';

const name_config: Config = {
    dictionaries: [adjectives, animals],
    separator: '',
    style: 'capital',
    length: 2
};

class DB {
    private db: IMonkManager = monk(process.env.DB_URI);
    private anagrams: ICollection;
    private users: ICollection;

    constructor() {
        this.anagrams = this.db.get('anagram-games');
        this.users = this.db.get('users');
    }

    // ANAGRAM METHODS
    createAnagramGame(game_object: Partial<AnagramObject>, callback?: (doc: AnagramObject) => void) {
        this.anagrams.insert(game_object)
            .then(callback)
            .catch(console.error);
    }

    updateAnagramGame(updating_user: User, game_id: string, updated_state: AnagramState, callback: (updated_doc: AnagramObject | undefined) => void) {
        this.anagrams.findOneAndUpdate(
            { _id: game_id },
            { $set: {['states.' + updating_user.user_id]: updated_state} }
        )
            .then(callback)
            .catch(console.error);
    }

    markAnagramGameAsViewed(user: User, game_id: string) {
        this.anagrams.findOneAndUpdate(
            { _id: game_id },
            { $set: {['states.' + user.user_id + '.viewed']: true }}
        )
            .catch(console.error);
    }

    getUserAnagramGames(user: User, callback: (docs: AnagramObject[]) => void) {
        this.anagrams.find({
            ['states.' + user.user_id]: { $exists: true }
        })
            .then(callback)
            .catch(console.error);
    }

    generateUsername(callback: (username: string) => void) {
        let username = uniqueNamesGenerator(name_config);

        this.users.find({
            username: username,
        }).then((docs: User[]) => {
            if (docs.length > 0) {
                this.generateUsername(callback);
            } else {
                callback(username);
            }
        });
    };

    // USER METHODS
    registerUser(user_id: string, callback: (res: User | Error) => void) {
        this.users.find({
            user_id: user_id
        })
            .then(docs => {
                if (docs.length > 0) {
                    callback(docs[0]);
                } else {
                    this.generateUsername(username => {
                        this.users.insert({
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

    setUsername(user: User, callback: (res: User | Error) => void) {
        if (user.username === '') callback(Error("Username cannot be empty!"));

        this.users.find({
            username: user.username
        })
            .then((docs: User[]) => {
                if (docs.length > 0) {
                    callback(Error("Username is taken! " + docs[0].username))
                } else {
                    this.users.findOneAndUpdate(
                        {user_id: user.user_id},
                        {$set: {username: user.username}}
                    )
                        .then(callback)
                        .catch(console.error);
                }
            })
            .catch(console.error);
    }

    getUserByName(username: string, callback: (user: User) => void) {
        this.users.findOne({
            username: username
        })
            .then(callback)
            .catch(console.error);
    }

    getUsersByName(usernames: string[], callback: (users: User[]) => void) {
        this.users.find({
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
}

export default new DB();