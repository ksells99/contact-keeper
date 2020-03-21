import React, {useState, useContext, useEffect} from 'react';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const Login = (props) => {
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);

    const {setAlert} = alertContext;

    const {login, error, clearErrors, isAuthenticated} = authContext;

    useEffect(() => {
        if(isAuthenticated) {
            props.history.push('/');   // redirect to homepage when logged in
        }

        if(error === 'Invalid credentials') {
            setAlert(error, 'danger');
            clearErrors();
        }
        // eslint-disable-next-line
    },[error, isAuthenticated, props.history]);  // runs when these change

    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const {email, password} = user;

    const onChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value});
    };
    
    const onSubmit = (e) => {
        e.preventDefault();
        if (email === '' || password === '') {
            setAlert('Please enter an email and password', 'danger');
        } else {                    // else login user
            login({
                email,
                password
            });             // will then become authenticated and login user
        }
    };




    return (
        <div className="form-container">
            <h1>
                Account <span className="text-primary">Login</span>
            </h1>
            <form onSubmit={onSubmit}>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" value={email} onChange={onChange} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} required/>
                </div>
                
                <input type="submit" value="Login" className="btn btn-primary btn-block"></input>
            </form>
        </div>
    )
}

export default Login;