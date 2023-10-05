import {useState} from 'react'
import axios from 'axios'


const signup = ()=>{

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errors,setErrors] = useState([])

    const onSubmit = async(event)=>{
        event.preventDefault();

        try {
            const response = await axios.post('/api/users/signup',{email,password});

            console.log(response.data);
        } catch (error) {
            
            setErrors(error.response.data.errors)
        }
    }

    return(
        <form onSubmit={onSubmit}>
        <h1>Signup</h1>
        <div className = "form-group">
            <label>Email address</label>
            <input className = "form-control"  value={email} onChange={e => setEmail(e.target.value)}/>
           
                {errors.length>0 && errors.map(err=>{
                     if (err.field === 'email') {
                        return <p className='alert alert-danger'>{err.message}</p>;
                    }
                })}
           
        </div>
        <div className = "form-group">
            <label>Password</label>
            <input type="password" className = "form-control" value={password} onChange={e => setPassword(e.target.value)}/>
                {errors.length>0 && errors.map(err=>{
                     if (err.field === 'password') {
                        return <p className='alert alert-danger'>{err.message}</p>;
                    }
                })}
        </div>
        <button className = "btn btn-primary mt-3"> Sign up</button>
        </form>

    )
}


export default signup;