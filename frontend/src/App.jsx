import Navbar from "./components/Navbar.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BudgetsPage from "./pages/BudgetsPage.jsx";
import GoalsPage from "./pages/GoalsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
    return (
        <BrowserRouter>


            <Routes>
                <Route path={"/"} element={<LandingPage/>}/>
                <Route path={"/login"} element={<LoginPage/>}/>
                <Route path={"/register"} element={<RegisterPage/>}/>
                <Route path={"/dashboard"} element={<DashboardPage/>}/>
                <Route path={"/budgets"} element={<BudgetsPage/>}/>
                <Route path={"/goals"} element={<GoalsPage/>}/>
                <Route path={"/profile"} element={<ProfilePage/>}/>



            </Routes>




        </BrowserRouter>
    )
}

export default App;