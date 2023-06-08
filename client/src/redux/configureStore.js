import {createStore, combineReducers, applyMiddleware}  from 'redux';
import {Test, Tests } from './TestAction';
import {Auth} from './auth';
import {Groups} from './groups';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = ()=>{
    const store = createStore(
        combineReducers({
            tests: Tests,
            auth:Auth,
            test: Test,
            groups: Groups

        }),
        applyMiddleware(thunk,logger)
    );

    return store;
}