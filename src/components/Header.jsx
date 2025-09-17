import { useState } from "react";
import logoErg from "../assets/compro/logoErg.png";
import { RiMenu5Fill } from "react-icons/ri";

const Header = () => {

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

    const [dropdown, setDropdown] = useState(false);
    const toggleDropdown = () => {
        setDropdown(!dropdown);
    }

    return (
        <div className="container mx-auto px-6 sm:px-12">
            <div className="flex flex-row justify-between items-center py-4">
                {/* logo */}
                <div>
                    <img src={logoErg} alt="Logo ERG" className="w-5 object-cover"/>
                </div>

                {/* Menu Desktop */}

                {/* Menu mobile button */}
                <div>
                    <RiMenu5Fill onClick={toggleDropdown} className="cursor-pointer"/>
                </div>
            </div>

            {/* Menu Mobile */}
            {dropdown && (
                <div className="absolute top-16 left-0 right-0 bg-white">
                    
                </div>
            )};
        </div>
    );
};

export default Header;