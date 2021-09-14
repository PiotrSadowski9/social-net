import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid, Loader } from 'semantic-ui-react'
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
    const {events, moreEvents} = useSelector(state => state.event); //pobieram dane ze Stora
    const {loading} = useSelector(state => state.async);
    const {authenticated} = useSelector(state => state.auth);
    const [lastDocSnapshot, setLastDocSnapshot] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(false);
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
        setLoadingInitial(true);
        dispatch(fetchEvents(predicate, limit)).then((lastVisible) => {
            setLastDocSnapshot(lastVisible);
            setLoadingInitial(false)
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
            {loadingInitial &&
                <>
                    <EventListItemPlaceholder/>
                    <EventListItemPlaceholder/>
                </>
            }
                <EventList  events={events}
                            getNextEvents={handleFetchNextEvent}
                            loading={loading}
                            moreEvents={moreEvents}
                />
               
            </Grid.Column>
            <Grid.Column width={6}>
                {authenticated && <EventsFeed/>}
                <EventFilters predicate={predicate} setPredicate={handleSetPredicate} loading={loading}/>
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loading}/>
            </Grid.Column>
        </Grid>
    )
}
