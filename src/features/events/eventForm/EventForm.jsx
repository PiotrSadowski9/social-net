import cuid from 'cuid';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, Header, Segment} from 'semantic-ui-react';
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
            <Form onSubmit={handleFormSubmit}>
                <Form.Field>
                    <input 
                        type="text" 
                        placeholder='Event title' 
                        name='title'
                        value={values.title}
                        onChange={(e) => handleInputChange(e)}
                        />
                </Form.Field>
                <Form.Field>
                    <input 
                        type="text" 
                        placeholder='Category' 
                        name='category'
                        value={values.category}
                        onChange={(e) => handleInputChange(e)}/>
                </Form.Field>
                <Form.Field>
                    <input 
                        type="text" 
                        placeholder='Description' 
                        name='description'
                        value={values.description}
                        onChange={(e) => handleInputChange(e)}/>
                </Form.Field>
                <Form.Field>
                    <input 
                        type="text" 
                        placeholder='City' 
                        name='city'
                        value={values.city}
                        onChange={(e) => handleInputChange(e)}/>
                </Form.Field>
                <Form.Field>
                    <input 
                        type="text" 
                        placeholder='Venue' 
                        name='venue'
                        value={values.venue}
                        onChange={(e) => handleInputChange(e)}/>
                </Form.Field>
                <Form.Field>
                    <input 
                        type="date" 
                        placeholder='Date' 
                        name='date'
                        value={values.date}
                        onChange={(e) => handleInputChange(e)}/>
                </Form.Field>
                <Button type='submit' floated='right' positive content='Submit'/>
                <Button as={Link} to='/events' type='submit' floated='right' content='Cancel'/>
                
            </Form>
        </Segment>
    )
}
