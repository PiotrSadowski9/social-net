import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  Grid, Loader } from 'semantic-ui-react'
import { fetchEvents } from '../eventActions';
import { RETAIN_STATE } from '../eventConstants';
import EventsFeed from '../EventsFeed';
import EventFilters from './EventFilters';
// import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventList from './EventList'
import EventListItemPlaceholder from './EventListItemPlaceholder';


export default function EventDashboard() {
    const limit = 2;
    const dispatch = useDispatch();
    const {events, moreEvents, filter, startDate, lastVisible, retainState} = useSelector(state => state.event); //pobieram dane ze Stora
    const {loading} = useSelector(state => state.async);
    const {authenticated} = useSelector(state => state.auth);
    
    const [loadingInitial, setLoadingInitial] = useState(false);
    

   

    useEffect(() => {
        if (retainState) return;
        setLoadingInitial(true);
        dispatch(fetchEvents(filter, startDate, limit)).then(() => {  
            setLoadingInitial(false)
        });
        return () => {
            dispatch({type: RETAIN_STATE}); //kiedy opuszczamy komponent, zachowujemy state w redux
        }
    }, [dispatch, filter, startDate, retainState]);

    function handleFetchNextEvent() {
        dispatch(fetchEvents(filter, startDate, limit, lastVisible));
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
                <EventFilters  loading={loading}/>
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loading}/>
            </Grid.Column>
        </Grid>
    )
}
