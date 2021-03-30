import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import { getEventsFromFirestore } from '../../../app/firestore/firestoreService';
import EventFilters from './EventFilters';
// import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventList from './EventList'
import EventListItemPlaceholder from './EventListItemPlaceholder';


export default function EventDashboard() {
    const {events} = useSelector(state => state.event); //pobieram dane ze Stora
    const {loading} = useSelector(state => state.async);

    useEffect(() => {
        const unsubscribe = getEventsFromFirestore({
            next: snapshot => console.log(snapshot.docs.map(docSnapshot => docSnapshot.data())), // po otrzymaniu danych z firestore
            error: error => console.log(error)
        })
    })
   
    
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
