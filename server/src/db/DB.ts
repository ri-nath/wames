import monk, { IMonkManager, ICollection } from 'monk';
import { adjectives, animals, Config } from 'unique-names-generator';

class DB {
    public db: IMonkManager = monk(process.env.DB_URI);
    public anagrams: ICollection;
    public users: ICollection;

    constructor() {
        this.anagrams = this.db.get('anagram-games');
        this.users = this.db.get('users');

        if (process.env.MODE === 'PRODUCTION') {
            console.log('Removing all debug games...');
            this.anagrams.remove({
                ['states.wames-debug']: { $exists: true }
            });
        }
    }
}

export default new DB();