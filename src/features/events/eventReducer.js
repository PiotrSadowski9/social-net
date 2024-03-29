// import { sampleData } from "../../app/api/sampleData";
import { DELETE_EVENT, UPDATE_EVENT, CREATE_EVENT, FETCH_EVENT,LISTEN_TO_EVENT_CHAT, CLEAR_COMMENTS, LISTEN_TO_SELECTED_EVENT, CLEAR_EVENTS, SET_FILTER, SET_START_DATE, RETAIN_STATE, CLEAR_TO_SELECTED_EVENT } from "./eventConstants";


const initialState = {
    events:[],
    comments:[],
    moreEvents: true,
    selectedEvent: null,
    lastVisible: null,
    filter: 'all',
    startDate: new Date(),
    retainState: false
}

export default function eventReducer(state = initialState, {type, payload}){
    switch (type) {
        case CREATE_EVENT:
            return {
                ...state,
                events: [...state.events,payload] // dodaję nowy event do tablicy
            };
        case UPDATE_EVENT:
            return {
                ...state,
                events: [...state.events.filter(evt => evt.id !== payload.id),payload] //filtruję tablicę eventów, szukam edytowanego eventu, usuwam i dodaję nowy
            };
        case DELETE_EVENT:
            return {
                ...state,
                events:  [...state.events.filter(evt => evt.id !== payload)] // filtruję tablice i usuwam event
            };
        case FETCH_EVENT:
            return {
                ...state,
                events: [...state.events, ...payload.events],
                moreEvents: payload.moreEvents,
                lastVisible: payload.lastVisible
            }
        case LISTEN_TO_EVENT_CHAT:
            return {
                ...state,
                comments: payload,
            }
        case CLEAR_COMMENTS:
            return {
                ...state,
                comments:[]
            }
        case LISTEN_TO_SELECTED_EVENT:
            return {
                ...state,
                selectedEvent: payload
            }
        case CLEAR_TO_SELECTED_EVENT:
            return {
                ...state,
                selectedEvent: null
            }
        case CLEAR_EVENTS:
            return {
                ...state,
                events:[],
                moreEvents:true,
                lastVisible: null
            }
        case SET_FILTER:
            return {
                ...state,
                retainState: false,
                moreEvents: true,
                filter: payload
            }
        case SET_START_DATE:
            return {
                ...state,
                retainState: false,
                moreEvents: true,
                startDate: payload
            }
        case RETAIN_STATE:
            return {
                ...state,
                retainState: true
            }
        default:
            return state;
    }
}