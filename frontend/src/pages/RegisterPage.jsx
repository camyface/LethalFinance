import UserForm from "../lethalfinance/user/UserForm.jsx";
import {boolean} from "yup";
import {saveUser} from "../services/UserService.js";

const RegisterPage = () => {





    return (
        <>
        <h1>Register Page</h1>
            <UserForm/>
        </>
    )
}

export default RegisterPage;