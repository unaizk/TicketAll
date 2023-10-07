import {useState} from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request';


const signin = ()=>{

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [doRequest,errors] = useRequest({
        url:'/api/users/signin',
        method:'post',
        body :{
            email,password
        },
        onSuccess : ()=> Router.push('/')//if the response is success it will call this function an route to landing page
    })
    const onSubmit = async(event)=>{
        event.preventDefault();
        console.log(errors);
        await doRequest();
    }

    return(
        <form onSubmit={onSubmit}>
        <h1>Signin</h1>
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


export default signin;