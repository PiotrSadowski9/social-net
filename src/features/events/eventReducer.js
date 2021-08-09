// import { sampleData } from "../../app/api/sampleData";
import { DELETE_EVENT, UPDATE_EVENT, CREATE_EVENT, FETCH_EVENT,LISTEN_TO_EVENT_CHAT } from "./eventConstants";


const initialState = {
    events:[],
    comments:[]
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
                events: payload
            }
        case LISTEN_TO_EVENT_CHAT:
            return {
                ...state,
                comments: payload,
            }
        default:
            return state;
    }
}