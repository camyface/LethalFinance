import {Link} from "react-router";

const LandingPage = () => {

    return (
        <>
            <h2>Login</h2>
            <Link as={Link} to={"/login"}>Login</Link>
            <br/>
            <Link as={Link} to={"/register"}>Register</Link>
            <br/>
            <Link as={Link} to={"/profile"}>Profile</Link>
        </>

    )
}

export default LandingPage;