import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/company-profile/Home";

const App = () => {

    const headerMenu = [
            {name: "Beranda", link: "/"},
            {name: "Tentang Kami", link: "/tentang-kami"},
            {name: "Unit Bisnis", dropdown: [
                {name: "Global Ekapaksi Lestari", link: "#"},
                {name: "Apex Tactix", link: "#"},
                {name: "Mediatama Eka Paksi", link: "#"},
                {name: "Rajawali Abadi Ekapaksi", link: "#"},
                {name: "Bahtera Kharisma Abadi", link: "#"},
            ]},
            {name: "Berita", link: "/berita"},
            {name: "Kontak", link: "/kontak"},
        ]

    return (
        <>
            <Router>
                <Header headerMenu={headerMenu} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin/*" element={<Dashboard />} />
                </Routes>
                
                <Footer footerMenu={headerMenu} />
            </Router>
        </>
    );
};

export default App;