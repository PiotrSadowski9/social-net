import cuid from 'cuid';
import { Formik, Form, Field } from 'formik';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Header, Segment, FormField} from 'semantic-ui-react';
import {createEvent, updateEvent} from '../eventActions'

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
    const [values,setValues] = useState(initialValues);

    function handleFormSubmit() { //Tworzę nowy event z podanych wartości

        selectedEvent 
        ? dispatch(updateEvent({...selectedEvent,...values})) //zachowuję dotychczasowe dane i nadpisuję te zmienione
        : dispatch(createEvent({...values,
                    id:cuid(), //id z biblioteki cuid
                    hostedBy:'Bob',
                    attendees:[],
                    hostPhotoURL:'/assets/user.png'}));
        history.push('/events') // po utworzeniu eventu przenosi na strone z eventami
       
    }
    function handleInputChange(e){
        const {name,value} = e.target;
        setValues({...values,[name]:value}); //przepisuje stare wartość i zmieniam wartość wyszczególnionej
    }


    return (
        <Segment clearing>
            <Header content={selectedEvent ? 'Edit the event' : 'Create new event'}/>
            <Formik
                initialValues={initialValues}
                onSubmit={values => console.log(values)}
            >
                <Form className='ui form'>
                <FormField>
                    <Field name='title' placeholder='Event title'/>
                </FormField>
                <FormField>
                    <Field name='category' placeholder='Category'/>
                </FormField>
                <FormField>
                    <Field name='description' placeholder='Description'/>
                </FormField>
                <FormField>
                    <Field name='city' placeholder='City'/>
                </FormField>
                <FormField>
                    <Field name='venue' placeholder='Venue'/>
                </FormField>
                <FormField>
                    <Field name='date' placeholder='Event date' type='date'/>
                </FormField>
                
                <Button type='submit' floated='right' positive content='Submit'/>
                <Button as={Link} to='/events' type='submit' floated='right' content='Cancel'/>
                
            </Form>
            
            
            </Formik>
            
        </Segment>
    )
}
