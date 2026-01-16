import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios'; // connecting to server
import { useNavigate, Link } from "react-router-dom"; // changing the Page 

function Signup() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [mobile, setMobile] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // data Server (Port 3001) 
        axios.post('http://localhost:3001/register', { name, email, mobile, password })
        .then(result => {
            console.log(result)
            
            navigate('/login')
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    
                    {/* Name Input */}
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Name</strong>
                        </label>
                        <input type="text"
                            placeholder="Enter Your Name"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input type="email"
                            placeholder="Enter Your Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Mobile Input */}
                    <div className="mb-3">
                        <label htmlFor="mobile">
                            <strong>Mobile</strong>
                        </label>
                        <input type="text"
                            placeholder="Enter Your Mobile Number"
                            autoComplete="off"
                            name="mobile"
                            className="form-control rounded-0"
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input type="password"
                            placeholder="Enter Your Password"
                            autoComplete="off"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Register
                    </button>
                </form>
                
                <p>Already Have an Account</p>
                {/* Link button Login page par jane ke liye */}
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Login
                </Link>
            </div>
        </div>
    )
};

export default Signup;