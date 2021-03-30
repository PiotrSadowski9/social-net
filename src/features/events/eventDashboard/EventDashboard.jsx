import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import { dataFromSnapshot, getEventsFromFirestore } from '../../../app/firestore/firestoreService';
import { listenToEvents } from '../eventActions';
import EventFilters from './EventFilters';
// import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventList from './EventList'
import EventListItemPlaceholder from './EventListItemPlaceholder';


export default function EventDashboard() {
    const dispatch = useDispatch();
    const {events} = useSelector(state => state.event); //pobieram dane ze Stora
    const {loading} = useSelector(state => state.async);

    useEffect(() => {
        const unsubscribe = getEventsFromFirestore({ //Listening danych z firestora
            next: snapshot => dispatch(listenToEvents(snapshot.docs.map(docSnapshot => dataFromSnapshot(docSnapshot)))), // otrzymywanie danych z firestore
            error: error => console.log(error)
        })
        return unsubscribe
    },[dispatch]) //uruchamiamy tylko jeśli dispatch jest na liście zmian. Powinien być tylko raz przy uruchamianiu
   
    
    return (
        <Grid>
            <Grid.Column width={10}>
            {loading &&
                <>
                    <EventListItemPlaceholder/>
                    <EventListItemPlaceholder/>
                </>
            }
                <EventList events={events}/>
            </Grid.Column>
            <Grid.Column width={6}>
                
                <EventFilters/>
            </Grid.Column>
        </Grid>
    )
}
