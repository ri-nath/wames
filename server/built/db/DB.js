"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monk_1 = require("monk");
class DB {
    constructor() {
        this.db = monk_1.default(process.env.DB_URI);
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
exports.default = new DB();
//# sourceMappingURL=DB.js.map