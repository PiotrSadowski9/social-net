import {combineReducers} from 'redux'
import testReducer from '../../features/sandbox/testReducer'
import eventReducer from '../../features/events/eventReducer'
import modalReducer from '../common/modals/modalReducer'


const rootReducer = combineReducers({  //zamieniam obiekt z dwiema wartościami reducerów na jeden reducer
    test: testReducer,
    event: eventReducer,
    modals:modalReducer
})

export default rootReducer
