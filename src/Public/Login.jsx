import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../Components/AuthProvider";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../Components/Hooks/useAxiosPublic";

const Login = () => {
    const { signIn, googleSignIn, } = useContext(AuthContext);
    const axiousPublic = useAxiosPublic();
    const navigate = useNavigate();
    const handleGoogleLogin = () => {
        googleSignIn()
            .then(result => {
                console.log(result.user.email);
                navigate(`/dashboard/${result?.user?.email}`)
                const dataToInsert = {
                    email:result.user.email,
                    image: result.user.photoURL,
                    fullName: result.user.displayName,
                }
                axiousPublic.post('/users', dataToInsert )
                    .then((res) => {
                        console.log(res.data);
                    })
                    .catch((error) => console.error(error));
            })
            .catch(error => {
                //toast.error(error.message);
            })
    }
    const hangleLogin = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log(email, password)
        if (email === '' || password === '') {
            //return toast.error("All feild are required")
        }
        signIn(email, password)
            .then(result => {
                console.log(result.user)
                //toast.success("Login Successfull")
            })
            .catch(error => {
                toast.error(error.message);
            })
    }
    return (
        <div>
            <div className="hero min-h-screen bg-base-200 rounded-none">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <img className="py-6" src="https://i.ibb.co/VTLm5Ld/Login-amico-removebg-preview.png" alt="jj" />
                    </div>
                    <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" placeholder="email" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password" placeholder="password" className="input input-bordered" required />
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button onClick={hangleLogin} className="btn btn-primary">Login</button>
                            </div>
                        </form>
                        <button onClick={handleGoogleLogin} className="btn btn-primary">Login</button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;