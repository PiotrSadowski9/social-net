// import { sampleData } from "../../app/api/sampleData";
import { DELETE_EVENT, UPDATE_EVENT, CREATE_EVENT, FETCH_EVENT,LISTEN_TO_EVENT_CHAT, CLEAR_COMMENTS, LISTEN_TO_SELECTED_EVENT, CLEAR_EVENTS } from "./eventConstants";


const initialState = {
    events:[],
    comments:[],
    moreEvents: true,
    selectedEvent: null
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
                moreEvents: payload.moreEvents
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
        case CLEAR_EVENTS:
            return {
                ...state,
                events:[],
                moreEvents:true
            }
        default:
            return state;
    }
}