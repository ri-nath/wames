import * as React from 'react';

import { MutableRefObject, RefObject } from 'react';
import { NavigationContainerRef, DrawerActions } from '@react-navigation/native';

import store from 'store/Store';
import {initialState, MenuState, State} from 'store/types';

class RootNavigator {
    public readonly navigationRef: RefObject<NavigationContainerRef> = React.createRef();
    private isMountedRef: MutableRefObject<any | null> = React.createRef();
    private buffer: Function[];

    private current_screen: MenuState["screen"];

    constructor() {
        this.navigationRef = React.createRef();
        this.isMountedRef = React.createRef();
        this.buffer = [];

        this.current_screen = initialState.menu.screen;

        store.subscribe(() => {
            // @ts-ignore
            const screen = store.getState().menu.screen;

            if (screen !== this.current_screen) {
                this.current_screen = screen;

                if (screen !== 'NONE') {
                    this.navigate(screen);
                }
            }
        });
    }

    mountNavigator(): void {
        this.isMountedRef.current = true;

        this.buffer.forEach((func: Function) => {
            func();
        });

        this.buffer = [];
    }

    unmountNavigator(): void {
        this.isMountedRef.current = false;
    }

    toggleDrawer() {
        if (this.isMountedRef.current && this.navigationRef.current) {
            this.navigationRef.current.dispatch(DrawerActions.toggleDrawer());
        } else {
            this.buffer.push(() => {
                this.toggleDrawer();
            });
        }
    }

    navigate(name: MenuState["screen"], params?: Object): void {
        if (this.isMountedRef.current && this.navigationRef.current) {
            this.current_screen = name;

            if (name !== 'Game Portal') {
                this.navigationRef.current.navigate('Menu', {
                    screen: name,
                    params: params,
                });
            } else {
                this.navigationRef.current.navigate(name);
            }
        } else {
            this.buffer.push(() => {
                this.navigate(name, params);
            });
        }
    }
}

export default new RootNavigator();