import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid } from 'semantic-ui-react'
import { listenToEventsFromFirestore } from '../../../app/firestore/firestoreService';
import useFirestoreCollection from '../../../app/hooks/useFirestoreCollection';
import { fetchEvents, listenToEvents } from '../eventActions';
import EventsFeed from '../EventsFeed';
import EventFilters from './EventFilters';
// import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventList from './EventList'
import EventListItemPlaceholder from './EventListItemPlaceholder';


export default function EventDashboard() {
    const limit = 2;
    const dispatch = useDispatch();
    const {events} = useSelector(state => state.event); //pobieram dane ze Stora
    const {loading} = useSelector(state => state.async);
    const {authenticated} = useSelector(state => state.auth);
    const [lastDocSnapshot, setLastDocSnapshot] = useState(null)
    const [predicate, setPredicate] = useState(
        new Map([
            ['startDate', new Date()],
            ['filter', 'all'],
        ])
    );

    function handleSetPredicate(key, value) {
        setPredicate(new Map(predicate.set(key, value)))
    }

    useEffect(() => {
        dispatch(fetchEvents(predicate, limit)).then((lastVisible) => {
            setLastDocSnapshot(lastVisible);
        })
    }, [dispatch, predicate]);

    function handleFetchNextEvent() {
        dispatch(fetchEvents(predicate, limit, lastDocSnapshot)).then((lastVisible) => {
            setLastDocSnapshot(lastVisible)
        })
    }
 
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
                <Button onClick={handleFetchNextEvent} color='green' content='More...' floated='right'/>
            </Grid.Column>
            <Grid.Column width={6}>
                {authenticated && <EventsFeed/>}
                <EventFilters predicate={predicate} setPredicate={handleSetPredicate} loading={loading}/>
            </Grid.Column>
        </Grid>
    )
}
