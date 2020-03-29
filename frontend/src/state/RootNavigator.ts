import * as React from 'react';

import { MutableRefObject, RefObject } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

import Anagram from 'lib/Anagram';

type Path = 'Anagram' | 'Play' | 'Settings';

class RootNavigator {
    public readonly navigationRef: RefObject<NavigationContainerRef> = React.createRef();
    private isMountedRef: MutableRefObject<any | null> = React.createRef();
    private buffer: Function[];

    constructor() {
        this.navigationRef = React.createRef();
        this.isMountedRef = React.createRef();
        this.buffer = [];
    }

    mountNavigator(): void {
        this.isMountedRef.current = true;

        this.buffer.forEach((func: Function) => {
           func();
        });

        this.buffer = [];
    }

    navigate(name: Path, params?: Object): void {
        if (this.isMountedRef.current && this.navigationRef.current) {
            this.navigationRef.current.navigate(name, params);
        } else {
            this.buffer.push(() => {
               this.navigate(name, params);
            });
        }
    }

    navigateToAnagramInfo(game: Anagram): void {
        this.navigate('Anagram', { game: game })
    }
}

export default new RootNavigator();