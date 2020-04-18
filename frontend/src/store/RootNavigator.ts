import { DrawerActions, NavigationContainerRef } from '@react-navigation/native';
import Settings from 'components/menu/subcomponents/Settings';
import * as React from 'react';
import { MutableRefObject, RefObject } from 'react';
import { setAppState, setMenuScreen } from 'store/actions';

import store from 'store/Store';

/*
 * UTILITY CLASS TO USE REACT-NAVIGATION WITH REDUX!
 */

class RootNavigator {
    public readonly navigationRef: RefObject<NavigationContainerRef> = React.createRef();
    private isMountedRef: MutableRefObject<any | null> = React.createRef();
    private buffer: Function[];

    private current_app_state: string;
    private current_menu_state: string;

    constructor() {
        this.navigationRef = React.createRef();
        this.isMountedRef = React.createRef();
        this.buffer = [];

        this.current_app_state = 'Loading';
        this.current_menu_state = 'Menu';

        store.subscribe(() => {
            const state = store.getState();

            if (state.app.state !== this.current_app_state) {
                this.navigate(state.app.state);
                this.current_app_state = state.app.state;
            } else if (state.app.state === 'Menu' && state.menu.screen !== this.current_menu_state) {
                if (state.menu.screen === 'Game Portal') {
                    this.navigate('Menu', { screen: 'Game Portal' });
                } else {
                    this.navigate('Menu', {
                        screen: 'Drawer',
                        params: {
                            screen: state.menu.screen
                        }
                    });
                }
                this.current_menu_state = state.menu.screen;
            }
        });

        this.onStateChange = this.onStateChange.bind(this);
    }

    onStateChange(nav_state: any) {
        const getActiveRouteName = (state: any): string => {
            const route = state.routes[state.index];

            if (route.state) {
                // Dive into nested navigators
                return getActiveRouteName(route.state);
            }

            return route.name;
        };

        const updateMenuScreen = (screen: 'Menu' | 'Game Portal') => {
            this.current_menu_state = screen;

            if (store.getState().menu.screen !== screen) {
                store.dispatch(setMenuScreen(screen));
            }
        };

        const updateAppScreen = (screen: 'Loading' | 'Menu' | 'Anagram Game') => {
            this.current_app_state = screen;

            if (store.getState().app.state !== screen) {
                store.dispatch(setAppState(screen));
            }
        };

        const route_name = getActiveRouteName(nav_state);

        const MenuScreens = ['Home', 'Games List', 'Settings'];
        const AppScreens = ['Loading', 'Menu', 'Anagram Game'];

        if (MenuScreens.includes(route_name)) {
            updateMenuScreen('Menu');
        } else if (route_name === 'Game Portal') {
            updateMenuScreen('Game Portal');
        } else if (AppScreens.includes(route_name)) {
            // @ts-ignore
            updateAppScreen(route_name);
        } else {
            throw Error('Unknown Navigation Route ' + route_name);
        }
    }

    mountNavigator(): void {
        this.isMountedRef.current = true;

        this.buffer.forEach((func: Function) => {
            func();
        });

        this.buffer = [];

        store.subscribe(() => {

        });
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

    navigate(name: string, params?: Object): void {
        if (this.isMountedRef.current && this.navigationRef.current) {
            this.navigationRef.current.navigate(name, params);
        } else {
            this.buffer.push(() => {
                this.navigate(name, params);
            });
        }
    }
}

export default new RootNavigator();