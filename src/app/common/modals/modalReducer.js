const OPEN_MODAL = 'OPEN_MODAL';  // stała action redux
const CLOSE_MODAL = 'CLOSE_MODAL';



export function openModal(payload) {  //action creator
    return {
        type: OPEN_MODAL,
        payload
    }
}