import React from 'react';

import { Provider } from 'react-redux';

import App from 'components/App';
import store from 'store/Store';

export default function Root() {
    return (
        <Provider store={store}>
            <App/>
        </Provider>
    )
}