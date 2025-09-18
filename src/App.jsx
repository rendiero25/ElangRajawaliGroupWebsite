import Header from "./components/Header";
import Footer from "./components/Footer";

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
            <Header headerMenu={headerMenu} />
            <Footer footerMenu={headerMenu} />
        </>
    );
};

export default App;