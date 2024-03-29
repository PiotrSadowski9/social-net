import React from 'react'
import { Grid} from 'semantic-ui-react'
import EventDetailedHeader from './EventDetailedHeader'
import EventDetailedInfo from './EventDetailedInfo'
import EventDetailedChat from './EventDetailedChat'
import EventDetailedSidebar from './EventDetailedSidebar'
import { useDispatch, useSelector } from 'react-redux'
import useFirestoreDoc from '../../../app/hooks/useFirestoreDoc'
import { listenToEventFromFirestore } from '../../../app/firestore/firestoreService'
import { listenToSelectedEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { Redirect } from 'react-router'

export default function EventDetailedPage({match}) { 
    const dispatch = useDispatch();
    const { currentUser} = useSelector((state) => state.auth);
    const event = useSelector(state => state.event.selectedEvent) //
    const {loading, error} = useSelector(state => state.async);
    const isHost = event?.hostUid === currentUser?.uid; //Optional chaining
    const isGoing = event?.attendees?.some(a => a.id === currentUser?.uid); //Optional chaining


    useFirestoreDoc({ // próba pobrania eventu ze stora, to jest useEffect
        query: () => listenToEventFromFirestore(match.params.id),
        data: event => dispatch(listenToSelectedEvent(event)),
        deps: [match.params.id, dispatch] //Jesli zmienimy Id, wywolujemy ponownie funkcję
    });

    if (loading || (!event && !error)) return <LoadingComponent content='Loading event...'/>;

    if (error) return <Redirect to='/error'/>
    
    return (
        
           <Grid>
               <Grid.Column width={10}>
                   <EventDetailedHeader event={event} isGoing={isGoing} isHost={isHost}/>
                   <EventDetailedInfo event={event}/>
                   <EventDetailedChat eventId={event.id}/>
               </Grid.Column>
               <Grid.Column width={6}>
                   <EventDetailedSidebar attendees={event?.attendees} hostUid = {event.hostUid}/>
               </Grid.Column>
           </Grid>
        
    )
}
