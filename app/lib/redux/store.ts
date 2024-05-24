import { createStore, combineReducers } from 'redux';
import counterReducer from './reducers';
import { toastReducer } from './toastReducer';

const rootReducer = combineReducers({
    counter: counterReducer,
    toast: toastReducer
})

export const store = createStore(rootReducer);