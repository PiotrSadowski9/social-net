import React from 'react'
import { useSelector } from 'react-redux';
import TestModal from '../../../features/sandbox/TestModal'
import LoginForm from '../../../features/auth/LoginForm'
import RegisterForm from '../../../features/auth/RegisterForm'

export default function ModalManager() {
    const modalLookup = {
        TestModal,
        LoginForm,
        RegisterForm,

    };
    const currentModal = useSelector(state => state.modals); // jesli jest jakiś modal, modalType i modalProps jest tutaj
    let renderedModal;
    if(currentModal) { 
        const {modalType, modalProps} = currentModal; //jeśli modal jest otworzony to tu mamy modalType i modalProps
        const ModalComponent = modalLookup[modalType]; //tworzę nowy model z podanego modalType
        renderedModal = <ModalComponent {...modalProps}/> // tworzę nowy modal i przekazuje wszystkie modalProps
    }

    return <span>{renderedModal}</span>
    
}
