
import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Confirm, Header, Segment} from 'semantic-ui-react';
import {  clearSelectedEvent, listenToSelectedEvent} from '../eventActions';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryData } from '../../../app/api/categoryOptions';
import MyDateInput from '../../../app/common/form/MydateInput';
import { addEventToFirestore, cancelEventToggle, listenToEventFromFirestore, updateEventInFirestore } from '../../../app/firestore/firestoreService';
import useFirestoreDoc from '../../../app/hooks/useFirestoreDoc';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { toast } from 'react-toastify';

export default function EventForm({match,history, location}) {
    
    const dispatch = useDispatch(); //dane ze stora
    const [loadingCancel, setLoadingCancel] = useState(false);//Confirm button
    const [confirmOpen, setconfirmOpen] = useState(false)//confirm button
    const {selectedEvent} = useSelector(state => state.event) //wybieram konkretny event 
    const {loading, error} = useSelector((state) => state.async)

    useEffect(() => {
        if(location.pathname !== '/createEvent') return;
        dispatch(clearSelectedEvent());

    },[dispatch, location.pathname])

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
    });

    async function handleConacelToggle(event) {
        setconfirmOpen(false);
        setLoadingCancel(true);
        try {
            await cancelEventToggle(event);
            setLoadingCancel(false)
        } catch (error) {
            setLoadingCancel(true);
            toast.error(error.message)
        }
    }

    useFirestoreDoc({ // próba pobrania eventu ze stora, to jest useEffect
        shouldExecute: match.params.id !== selectedEvent?.id && location.pathname !== '/createEvent',
        query: () => listenToEventFromFirestore(match.params.id),
        data: (event) => dispatch(listenToSelectedEvent(event)),
        deps: [match.params.id, dispatch] //Jesli zmienimy Id, wywolujemy ponownie funkcję
    });


    if (loading) return <LoadingComponent content='Loading event...'/>;

    if (error) return <Redirect to='/error'/>
  


    return (
        <Segment clearing>
            
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, {setSubmitting}) => {
                    try {
                        selectedEvent 
                            ? await updateEventInFirestore(values) //uddateujemy event w Firestore
                            : await addEventToFirestore(values);    // dodajemy event do Firestora
                        setSubmitting(false)
                    history.push('/events') // po utworzeniu eventu przenosi na strone z eventami
                    } catch (error) {
                        toast.error(error.message);
                        setSubmitting(false);
                    }
                  
                }}
            >
                {({isSubmitting, dirty, isValid}) => (
                <Form className='ui form'>
                    <Header sub color='teal' content='Event Details'/>
                    <MyTextInput name='title' placeholder='Event title'/>
                    <MySelectInput name='category' placeholder='Event category' options={categoryData}/>
                    <MyTextArea name='description' placeholder='Description' rows={3}/>
                    <Header sub color='teal' content='Event Location Details'/>
                    <MyTextInput name='city' placeholder='City'/>
                    <MyTextInput name='venue' placeholder='Venue'/>
                    <MyDateInput
                        name='date' 
                        placeholderText='Event date'
                        timeFormat='HH:mm'
                        showTimeSelect
                        timeCaption='time'
                        dateFormat='MMMM d, yyyy h:mm a'
                        autoComplete='off'
                        />
                     {selectedEvent &&
                        <Button 
                        loading={loadingCancel}
                        type='button' 
                        floated='left' 
                        color= {selectedEvent.isCancelled ? 'green' : 'red'}
                        content={selectedEvent.isCancelled ? 'Reactive event' : 'Cancel Event'}
                        onClick={() => setconfirmOpen(true)}
                        />
                     }   
                    
                    <Button 
                        loading={isSubmitting}
                        disabled={!isValid || !dirty || isSubmitting} 
                        type='submit' 
                        floated='right' 
                        positive 
                        content='Submit'/>

                    <Button
                        disabled={isSubmitting} 
                        as={Link} 
                        to='/events' 
                        type='submit' 
                        floated='right' 
                        content='Cancel'/>
                
                </Form>
                )}
                
            
            
            </Formik>
            <Confirm
                content={selectedEvent?.isCancelled ? 'This will reactivate the event - are you sure?' :
                 'This will cancel the event - are yuo sure?'}
                 open={confirmOpen}
                 onCancel={()=> setconfirmOpen(false)}
                 onConfirm={()=> handleConacelToggle(selectedEvent)}
            />
        </Segment>
    )
}
