import { Linking } from 'expo';
import { AnagramObject } from '../../types';
import Anagram from 'lib/Anagram';
import ServerStore from 'server/ServerStore';
import AnagramStore from 'state/AnagramStore';
import RootNavigator from 'state/RootNavigator';

class LinkHandler {
    private readonly path: string;
    private readonly initial_url: any;

    constructor() {
        // IF STANDALONE: myapp://
        // IF DEVELOPMENT: exp://localhost:19000
        // IF PRODUCTION: exp://exp.host/@community/with-webbrowser-redirect

        this.path = Linking.makeUrl();

        Linking.getInitialURL().then((res: string | null) => {
            if (res) {
                this.parseURL(res);
            }
        });

        Linking.addEventListener('url', (e) => this.parseURL(e.url));
    }

    createGameURL(game: Anagram): string {
        return Linking.makeUrl('portal/anagrams', { id: game.getID() });
    }

    parseURL(url: string) {
        let { path, queryParams } = Linking.parse(url);

        console.log(`Linked to app with path: ${path} and data: ${JSON.stringify(queryParams)}`);

        if (path && queryParams && queryParams.id && path.includes('anagrams')) {
            ServerStore.onConnect(() => {
                // @ts-ignore
                ServerStore.joinGameByID(queryParams.id, (res: AnagramObject | null) => {
                    if (res) {
                        const wrapped = new Anagram(res, ServerStore.getUserID());

                        AnagramStore.processLoadGame(wrapped, false);
                        RootNavigator.navigateToAnagramInfo(wrapped);
                    }
                })
            })
        }
    }
}

export default new LinkHandler();