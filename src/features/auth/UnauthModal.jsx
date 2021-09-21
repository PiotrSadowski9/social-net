import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, Modal } from 'semantic-ui-react';
import { openModal } from '../../app/common/modals/modalReducer';

export default function UnauthModal({history}) {
    const [open, setOpen] = useState(true);
    const {prevLocation} = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    function handleClose(){

        if (history && prevLocation) {
            history.push(prevLocation.pathname);
        } else {
            history.push('/events')
            console.log("dupa")
        }
        
        setOpen(false);
    }
    return (
        <Modal open={open} size='mini' onClose={handleClose}>
        <Modal.Header content='You need to be signed in to do that'/>
        <Modal.Content>
            <p>Please login or register to see this content</p>
            <Button.Group widths={4}>
                <Button fluid color='teal' content='Login' onClick={() => dispatch(openModal({modalType: 'LoginForm'}))}/>
                <Button.Or/>
                <Button fluid color='green' content='Register' onClick={() => dispatch(openModal({modalType: 'RegisterForm'}))}/>
            </Button.Group>
            <Divider/>
            <div style={{textAlign:'center'}}>
                <p>Or click cancel to continue as a guest</p>
                <Button onClick={handleClose} content='Cancel'/>
            </div>
        </Modal.Content>
            
        </Modal>
    )
}
