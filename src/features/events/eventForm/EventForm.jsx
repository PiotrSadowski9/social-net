import cuid from 'cuid';
import { Formik, Form } from 'formik';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Header, Segment} from 'semantic-ui-react';
import {createEvent, updateEvent} from '../eventActions';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';

export default function EventForm({match,history}) {
    
    const dispatch = useDispatch(); //dane ze stora
    const selectedEvent = useSelector(state => state.event.events.find(e => e.id === match.params.id)) //wybieram konkretny event ze stora w oparciu o id eventu
    
    const initialValues = selectedEvent ?? { //ustawiam initialValues na pobrane dane ze Stora albo na pusty formularz
        title:'',
        category:'',
        description:'',
        city:'',
        venue:'',
        date:''
    }

    const validationSchema = Yup.object({  //walidacja formularza
        title: Yup.string().required('You must provide a title'),
        category: Yup.string().required('You must provide a category'),
        description: Yup.string().required(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
        date: Yup.string().required(),
    })
  


    return (
        <Segment clearing>
            
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={values => {
                    selectedEvent 
                    ? dispatch(updateEvent({...selectedEvent,...values})) //zachowuję dotychczasowe dane i nadpisuję te zmienione
                    : dispatch(createEvent({...values,
                    id:cuid(), //id z biblioteki cuid
                    hostedBy:'Bob',
                    attendees:[],
                    hostPhotoURL:'/assets/user.png'}));
                history.push('/events') // po utworzeniu eventu przenosi na strone z eventami
                }}
            >
                <Form className='ui form'>
                    <Header sub color='teal' content='Event Details'/>
                    <MyTextInput name='title' placeholder='Event title'/>
                    <MyTextInput name='category' placeholder='Event category'/>
                    <MyTextInput name='description' placeholder='Description'/>
                    <Header sub color='teal' content='Event Location Details'/>
                    <MyTextInput name='city' placeholder='City'/>
                    <MyTextInput name='venue' placeholder='Venue'/>
                    <MyTextInput name='date' placeholder='Event date' type='date'/>
                    <Button type='submit' floated='right' positive content='Submit'/>
                    <Button as={Link} to='/events' type='submit' floated='right' content='Cancel'/>
                
                </Form>
            
            
            </Formik>
            
        </Segment>
    )
}
