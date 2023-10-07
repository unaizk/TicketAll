import buildClient from "../api/build-client";

const Landing = ({ currentUser }) => {
    return currentUser ? <h1>You are signed in</h1>:<h1>You are not signed in</h1>
};

Landing.getInitialProps = async (context) => {
    const client = buildClient(context);
    
        const { data } = await client.get('/api/users/currentuser').catch(err=>{
            
            return { currentUser: 'data' }
        });
        console.log('API call successful. Received data:', data);
        return { currentUser: data };
 
      
}

export default Landing;
