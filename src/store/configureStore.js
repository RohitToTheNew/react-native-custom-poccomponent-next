import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './rootReducer';

const enhancer = compose(
    applyMiddleware(
        thunk
    ),
);
export const store = createStore(reducer, {}, enhancer);
