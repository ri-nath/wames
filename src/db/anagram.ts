import { Acknowledgement, AnagramObject, AnagramState, Hesitant, User } from '../ts';
import DB from './DB';
import { createError, defaultState } from '../api';

function handle_error(error: Error, callback: Hesitant<any>) {
    console.error(error);

    callback(createError('FAILED', error.name + ': ' + error.message));
}

export function createAnagramGame(game_object: Partial<AnagramObject>, callback: Acknowledgement<AnagramObject>) {
    DB.anagrams.insert(game_object)
        .then(callback)
        .catch(e => handle_error(e, callback));
}

export function updateAnagramGame(updating_user: User, game_id: string, updated_state: AnagramState, callback: Acknowledgement<AnagramObject>) {
    DB.anagrams.findOneAndUpdate(
        { _id: game_id },
        { $set: {['states.' + updating_user.user_id]: updated_state} }
    )
        .then(callback)
        .catch(e => handle_error(e, callback));
}

export function markAnagramGameAsViewed(user: User, game_id: string, callback: Acknowledgement<void>) {
    DB.anagrams.findOneAndUpdate(
        { _id: game_id },
        { $set: {['states.' + user.user_id + '.viewed']: true }}
    )
        .catch(e => handle_error(e, callback));
}

export function getUserAnagramGames(user: User, callback: Acknowledgement<AnagramObject[]>) {
    DB.anagrams.find({
        ['states.' + user.user_id]: { $exists: true }
    })
        .then(callback)
        .catch(e => handle_error(e, callback));
}

export function joinAnagramGame(id: string, user: User, callback: Acknowledgement<AnagramObject>) {
    DB.anagrams.findOneAndUpdate(
        { _id: id },
        { $set: { ['states.' + user.user_id]: defaultState }, $push: { users: user } },
    )
        .then(callback)
        .catch(e => handle_error(e, callback));
}

export function getAnagramGame(id: string, callback: Acknowledgement<AnagramObject>) {
    DB.anagrams.findOne(
        { _id: id }
    )
        .then(callback)
        .catch(e => handle_error(e, callback));
}