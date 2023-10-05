import {useState} from 'react'
import axios from 'axios'
import useRequest from '../../hooks/use-request';


const signup = ()=>{

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [doRequest,errors] = useRequest({
        url:'/api/users/signup',
        method:'post',
        body :{
            email,password
        }
    })
    const onSubmit = async(event)=>{
        event.preventDefault();
        console.log(errors);
        doRequest();
    }

    return(
        <form onSubmit={onSubmit}>
        <h1>Signup</h1>
        <div className = "form-group">
            <label>Email address</label>
            <input className = "form-control"  value={email} onChange={e => setEmail(e.target.value)}/>
            {/* if it is error based on email that has field ==='email' */}
            {errors.emailErrors.map((error) => (
                <p className='alert alert-danger' key={error.message}>{error.message}</p>
            ))}
           
        </div>
        <div className = "form-group">
            <label>Password</label>
            <input type="password" className = "form-control" value={password} onChange={e => setPassword(e.target.value)}/>
            {/* if it is error based on password that has field ==='password' */}
            {errors.passwordErrors.map((error) => (
                <p className='alert alert-danger' key={error.message}>{error.message}</p>
            ))}
            {/* if it is other any error that has no field */}
            {errors.otherErrors.map((error) => (
                <p className='alert alert-danger' key={error.message}>{error.message}</p>
            ))}

        </div>
        <button className = "btn btn-primary mt-3"> Sign up</button>
        </form>

    )
}


export default signup;