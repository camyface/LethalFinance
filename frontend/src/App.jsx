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
import SideNav from "./components/SideNav.jsx";
import {useState} from "react";
import AppLayout from "./components/AppLayout.jsx";
import RetirementPlansPage from "./pages/RetirementPlansPage.jsx";
import {TspPage} from "./pages/TspPage.jsx";



const App = () => {

    const [activeView, setActiveView] = useState('dashboard');
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    return (

        <BrowserRouter>

            <Routes>
                <Route path="/"         element={<LandingPage />} />
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes — wrapped in AppLayout */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/budgets"   element={<BudgetsPage />} />
                    <Route path="/goals"     element={<GoalsPage />} />
                    <Route path="/profile"   element={<ProfilePage />} />
                    <Route path="/plans"   element={<RetirementPlansPage/>} />
                    <Route path="/tsp"   element={<TspPage/>} />
                </Route>
            </Routes>


        </BrowserRouter>
    )
}

export default App;