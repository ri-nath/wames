import { AnagramObject, AnagramState, User } from '../ts';
import DB from './DB';
import { defaultState } from '../api';

export function createAnagramGame(game_object: Partial<AnagramObject>, callback?: (doc: AnagramObject) => void) {
    DB.anagrams.insert(game_object)
        .then(callback)
        .catch(console.error);
}

export function updateAnagramGame(updating_user: User, game_id: string, updated_state: AnagramState, callback: (updated_doc: AnagramObject | undefined) => void) {
    DB.anagrams.findOneAndUpdate(
        { _id: game_id },
        { $set: {['states.' + updating_user.user_id]: updated_state} }
    )
        .then(callback)
        .catch(console.error);
}

export function markAnagramGameAsViewed(user: User, game_id: string) {
    DB.anagrams.findOneAndUpdate(
        { _id: game_id },
        { $set: {['states.' + user.user_id + '.viewed']: true }}
    )
        .catch(console.error);
}

export function getUserAnagramGames(user: User, callback: (docs: AnagramObject[]) => void) {
    DB.anagrams.find({
        ['states.' + user.user_id]: { $exists: true }
    })
        .then(callback)
        .catch(console.error);
}

export function joinAnagramGame(id: string, user: User, callback: (doc: AnagramObject | null) => void) {
    DB.anagrams.findOneAndUpdate(
        { _id: id },
        { $set: { ['states.' + user.user_id]: defaultState }, $push: { users: user } },
    )
        .then(callback)
        .catch(console.error);
}

export function getAnagramGame(id: string, callback: (doc: AnagramObject | null) => void) {
    DB.anagrams.findOne(
        { _id: id }
    )
        .then(callback)
        .catch(console.error);
}