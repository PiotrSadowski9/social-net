import React from 'react';
import {  useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import {Dropdown, Image, Menu } from 'semantic-ui-react'
import { signOutFirebase } from '../../app/firestore/firebaseService';


export default function SignedInMenu() {

    const {currentUserProfile} = useSelector(state => state.profile)
   
   
   
    
   
    const history = useHistory(); //daje dostęp do ścieżki dosßepu kiedy nie ma Route'a

    async function handleSignOut() {
        try {
            history.push('/');// kiedy nie ma Routa
            await signOutFirebase();
           
        } catch (error) {
            toast.error(error.message)
        }
    }
    

    return (
        <Menu.Item position='right'>
                   <Image avatar spaced='right' src={currentUserProfile?.photoURL ||'/assets/user.png'}/>
                   <Dropdown pointing='top left' text={currentUserProfile?.displayName}>
                       <Dropdown.Menu>
                           <Dropdown.Item as={Link} to='/createEvent' text='Create new Event' icon='plus'/>
                           <Dropdown.Item as={Link} to={`profile/${currentUserProfile?.id}`} text='My profile' icon='user'/>
                           <Dropdown.Item as={Link} to='/account' text='My account' icon='settings'/>
                           <Dropdown.Item onClick={handleSignOut} text='Sign out' icon='power'/>
                       </Dropdown.Menu>
                   </Dropdown>
        </Menu.Item> 
    )
}
