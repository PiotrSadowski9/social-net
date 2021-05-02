import React from 'react';
import { useSelector } from 'react-redux';
import { Route, useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import AccountPage from '../../features/auth/AccountPage';
import EventDashboard from '../../features/events/eventDashboard/EventDashboard';
import EventDetailedPage from '../../features/events/eventDetailed/EventDetailedPage';
import EventForm from '../../features/events/eventForm/EventForm';
import HomePage from '../../features/home/HomePage';
import NavBar from '../../features/nav/NavBar';
import Sandbox from '../../features/sandbox/Sandbox';
import ErrorComponent from '../common/errors/ErrorComponent';
import ModalManager from '../common/modals/ModalManager';
import LoadingComponent from './LoadingComponent';



function App() {

  const {key} = useLocation(); //pobieram props location key i przekazuję go do Route EventForm by każdy Form miał unikalny key
  const {initialized} = useSelector((state => state.async)) // wstrzymuje ładowanie się aplikacji dopóki App loaded nie będzie true

  if (!initialized) return <LoadingComponent content='Loading app...'/>
 
  return (
    <>
      <ModalManager/>
      <ToastContainer position='bottom-right' hideProgressBar/>
      <Route exact path='/' component={HomePage}/>
      <Route 
        path={'/(.+)'} //wszystko co ma slash plus coś
        render={() => (
          <>
            <NavBar />
            <Container className={'main'}>
              <Route exact path='/events' component={EventDashboard}/>
              <Route exact path='/sandbox' component={Sandbox}/>
              <Route path='/events/:id' component={EventDetailedPage}/>
              <Route path={['/createEvent',`/manage/:id`]} component={EventForm} key={key}/>
              <Route path='/account' component={AccountPage}/>
              <Route path='/error' component={ErrorComponent}/>
            </Container>
          </>
        )}
      />
      
      
    </>
  );
} 

export default App;
