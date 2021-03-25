const OPEN_MODAL = 'OPEN_MODAL';  // stała action redux
const CLOSE_MODAL = 'CLOSE_MODAL';



export function openModal(payload) {  //action creator
    return {
        type: OPEN_MODAL,
        payload
    }
}

export function closeModal() {  //action creator
    return {
        type: CLOSE_MODAL,     
    }
}


const initialState = null;

//reducer funtion
export default function modalReducer(state = initialState,{type, payload}){
    switch (type) {
        case OPEN_MODAL:
            const {modalType, modalProps} = payload;
            return {modalType, modalProps}  //pobieramy modalType i modalProps z payload i przekazujemy do compomentu modal
        case CLOSE_MODAL:
            return null;  
        default:
            return state;      

    }
}