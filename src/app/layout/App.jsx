import React from 'react';
import { Route } from 'react-router';
import { Container } from 'semantic-ui-react';
import EventDashboard from '../../features/events/eventDashboard/EventDashboard';
import EventDetailedPage from '../../features/events/eventDetailed/EventDetailedPage';
import EventForm from '../../features/events/eventForm/EventForm';
import HomePage from '../../features/home/HomePage';
import NavBar from '../../features/nav/NavBar';



function App() {
 
  return (
    <>
      <Route exact path='/' component={HomePage}/>
      <Route 
        path={'/(.+)'} //wszystko co ma slash plus coś
        render={() => (
          <>
            <NavBar />
            <Container className={'main'}>
            {/* <EventDashboard formOpen={formOpen} setFormOpen={setFormOpen} selectEvent={handleSelectEvent} selectedEvent={selectedEvent}/> */}
        
              <Route exact path='/events' component={EventDashboard}/>
              <Route path='/events/:id' component={EventDetailedPage}/>
              <Route path={['/createEvent',`/manage/:id`]} component={EventForm}/>
            </Container>
          </>
        )}
      />
      
      
    </>
  );
}

export default App;
