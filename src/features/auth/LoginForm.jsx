import { Form, Formik } from 'formik';
import React from 'react';
import ModalWrapper from '../../app/common/modals/ModalWrapper';
import * as Yup from 'yup';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Divider, Label } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../app/common/modals/modalReducer';
import { signInWithEmail } from '../../app/firestore/firebaseService';
import SocialLogin from './SocialLogin';

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
            onSubmit = {async (values,{setSubmitting, setErrors} )=> {
                try {
                    await signInWithEmail(values);// przesyłam wartosci do Stora redux
                          setSubmitting(false); 
                          dispatch(closeModal());//przesyłam do Stora, wykonuje reducera CloseModal i zamykam modal logowania
                } catch (error) {
                    setErrors({auth: "Problem with username or password"})
                    setSubmitting(false);
                }
            }}
            >
            {({isSubmitting, isValid, dirty,errors}) => (
                <Form className='ui form'>
                   <MyTextInput name='email' placeholder='E-mail Address'/>
                   <MyTextInput name='password' placeholder='Password' type='password'/>
                    {errors.auth && <Label basic color='red' style={{marginBottom:10}} content={errors.auth} />}
                   <Button
                       loading={isSubmitting}
                       disabled={!isValid || !dirty || isSubmitting}
                       type='submit'
                       fluid
                       size='large'
                       color='teal'
                       content='Login'
                   />
                   <Divider horizontal>Or</Divider>
                   <SocialLogin/> 
                </Form>
            )}
            </Formik>
        </ModalWrapper>
    )
}
