import { CREATE_EVENT, SET_FILTER, DELETE_EVENT, FETCH_EVENT, UPDATE_EVENT,LISTEN_TO_EVENT_CHAT, LISTEN_TO_SELECTED_EVENT, CLEAR_EVENTS, SET_START_DATE, CLEAR_TO_SELECTED_EVENT } from "./eventConstants";
import {asyncActionError, asyncActionFinish, asyncActionStart} from '../../app/async/asyncReducer';
import { dataFromSnapshot, fetchToEventsFromFirestore } from "../../app/firestore/firestoreService";

export function fetchEvents(filter, startDate, limit, lastDocSnapshot) {
    return async function(dispatch) {
        dispatch(asyncActionStart())
        try {
            const snapshot = await fetchToEventsFromFirestore(filter, startDate, limit, lastDocSnapshot).get();
            const lastVisible = snapshot.docs[snapshot.docs.length-1];
            const moreEvents = snapshot.docs.length >= limit;
            const events = snapshot.docs.map(doc => dataFromSnapshot(doc));
            dispatch({type: FETCH_EVENT, payload:{events, moreEvents, lastVisible}});
            dispatch(asyncActionFinish());
            
        } catch (error) {
            dispatch(asyncActionError(error))
        }
    }
}

export function setFilter(value) {
    return function(dispatch) {
        dispatch(clearEvents());
        dispatch({type: SET_FILTER, payload: value})
    }
}
export function setStartDate(date) {
    return function(dispatch) {
        dispatch(clearEvents());
        dispatch({type: SET_START_DATE, payload: date})
    }
}


export function listenToSelectedEvent(event) {
    return {
        type: LISTEN_TO_SELECTED_EVENT,
        payload:event
    }
}

export function clearSelectedEvent() {
    return {
        type: CLEAR_TO_SELECTED_EVENT
    }
}

export function createEvent(event) {
    return {
        type: CREATE_EVENT,
        payload:event
    }
}
export function updateEvent(event) {
    return {
        type: UPDATE_EVENT,
        payload:event
    }
}
export function deleteEvent(eventId) {
    return {
        type: DELETE_EVENT,
        payload:eventId
    }
}

export function listenToEventChat(comments) {
    return {
        type: LISTEN_TO_EVENT_CHAT,
        payload: comments
    }
}

export function clearEvents() {
    return {
        type: CLEAR_EVENTS,
    }
}