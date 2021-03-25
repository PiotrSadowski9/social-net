import { Form, Formik } from 'formik';
import React from 'react';
import ModalWrapper from '../../app/common/modals/ModalWrapper';
import * as Yup from 'yup';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { signInUser } from './authActions';
import { closeModal } from '../../app/common/modals/modalReducer';

export default function LoginForm() {
    const dispatch = useDispatch();
    return (
        <ModalWrapper size='mini' header='Sign in to Re-vents'>
            <Formik
            initialValues={{email:'',password:''}}
            validationSchema={Yup.object({
                email: Yup.string().required().email(),
                password: Yup.string().required()
            })}
            onSubmit = {(values,{setSubmitting} )=> {
                dispatch(signInUser(values));// przesyłam wartosci do Stora redux
                setSubmitting(false); 
                dispatch(closeModal());//przesyłam do Stora, wykonuje reducera CloseModal i zamykam modal logowania
            }}
            >
            {({isSubmitting, isValid, dirty}) => (
                <Form className='ui form'>
                   <MyTextInput name='email' placeholder='Email Address'/>
                   <MyTextInput name='password' placeholder='Password' type='password'/>
                   <Button
                       loading={isSubmitting}
                       disabled={!isValid || !dirty || isSubmitting}
                       type='submit'
                       fluid
                       size='large'
                       color='teal'
                       content='Login'
                   /> 
                </Form>
            )}
            </Formik>
        </ModalWrapper>
    )
}
