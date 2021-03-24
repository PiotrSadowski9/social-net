import { useField, useFormikContext } from 'formik'
import React from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormField, Label} from 'semantic-ui-react';

export default function MyDateInput({label, ...props}) {
    const {setFieldValue} = useFormikContext(); //W DatePicker nie można zmieniać value przez helpers, używam formikContext by pobrac state form i ustawic value
    const [field, meta] = useField(props); 
    return (   //zamieniam meta.error na boolean // meta touched - czy był edytowany
        <FormField error={meta.touched && !!meta.error}>  
            <label>{label}</label>
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => setFieldValue(field.name, value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
            
        </FormField>
    )
}
