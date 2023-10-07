import React, { useState } from 'react'
import axios from 'axios'

const useRequest = ({url,method,body,onSuccess}) => {

    const [errors,setErrors] = useState({
        passwordErrors: [],
        emailErrors: [],
        otherErrors: []
    })

    const doRequest = async()=>{
        try {

            setErrors({
                passwordErrors: [],
                emailErrors: [],
                otherErrors: []
            }); // Clear any previous errors

            const response = await axios[method](url,body)
            if(onSuccess){
                onSuccess(response.data)
            }
            return response
        } catch (err) {
            const newErrors = {
                passwordErrors: err.response.data.errors.filter(err => err.field === 'password'),
                emailErrors: err.response.data.errors.filter(err => err.field === 'email'),
                otherErrors: err.response.data.errors.filter(err => !err.field) // Errors without a field
            };
            setErrors(newErrors);
           
        }
    }

    return [doRequest,errors]
}

export default useRequest