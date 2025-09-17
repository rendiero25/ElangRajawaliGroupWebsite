import { useState } from "react";
import logoErg from "../assets/compro/logoErg.png";
import bgHeader from "../assets/compro/bgHeader.png";
import { RiMenu5Fill } from "react-icons/ri";
import { FaSortDown } from "react-icons/fa";

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

    const [dropdownUnitBusiness, setDropdownUnitBusiness] = useState(false);
    const toggleDropdownUnitBusiness = () => {
        setDropdownUnitBusiness(!dropdownUnitBusiness);
    }

    const [language, setLanguage] = useState("id");
    const toggleLanguage = () => {
        setLanguage(language === "id" ? "en" : "id");
    }

    return (
        <div style={{backgroundImage: `url(${bgHeader})`, width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", }}> 
            <div className="container mx-auto px-6 flex flex-row justify-between items-center">
                {/* logo */}
                <div className="w-20 py-2 flex justify-center items-center">
                    <img src={logoErg} alt="Logo ERG" className="w-full object-cover"/>
                </div>

                {/* Menu Desktop */}
                <div className="hidden xl:flex justify-start items-center -ml-100">
                    <ul className="flex flex-row items-center">
                        {headerMenu.map((item, index) => (
                            <li key={index} className="relative group">
                                {item.dropdown ? (
                                    <div 
                                        onClick={toggleDropdownUnitBusiness}
                                        className="font-medium text-white text-xl cursor-pointer px-4 py-2 flex items-center"
                                        onMouseEnter={() => item.dropdown && setDropdownUnitBusiness(true)}
                                        onMouseLeave={() => {
                                            if (item.dropdown) {
                                                // Small delay to allow moving to dropdown
                                                setTimeout(() => {
                                                    if (!document.querySelector('.absolute')?.matches(':hover')) {
                                                        setDropdownUnitBusiness(false);
                                                    }
                                                }, 100);
                                            }
                                        }}
                                    >
                                        {item.name}
                                        <span className="ml-1 text-md"><FaSortDown /></span>
                                    </div>
                                ) : (
                                    <a 
                                        href={item.link} 
                                        className="font-medium text-white text-xl px-4 py-2 block"
                                    >
                                        {item.name}
                                    </a>
                                )}

                                {item.dropdown && dropdownUnitBusiness && (
                                    <div 
                                        className="absolute left-0 w-64 bg-white rounded shadow-lg z-50"
                                        onMouseEnter={() => setDropdownUnitBusiness(true)}
                                        onMouseLeave={() => setDropdownUnitBusiness(false)}
                                    >
                                        {item.dropdown.map((subItem, subIndex) => (
                                            <a 
                                                key={subIndex}
                                                href={subItem.link} 
                                                className="flex flex-col w-full px-6 py-3 text-gray-800 hover:bg-gray-100 font-medium"
                                            >
                                                {subItem.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="hidden lg:flex flex-row items-center gap-4 text-white font-medium">
                    <h3>ind</h3>
                    <h3>eng</h3>
                </div>

                {/* Menu mobile button */}
                <div className="xl:hidden justify-end items-center px-6">
                    <RiMenu5Fill onClick={toggleDropdown} className="cursor-pointer text-white text-4xl"/>
                </div>
            </div>

            {dropdown && (
                <div className="lg:hidden flex flex-col justify-center items-start px-6 gap-4 py-6">
                    {headerMenu.map((item, index) => (
                        <div key={index} className="w-full">
                            {item.dropdown ? (
                                <div>
                                    <div 
                                        onClick={toggleDropdownUnitBusiness}
                                        className="font-medium text-white text-xl cursor-pointer flex items-center justify-between w-full py-2"
                                    >
                                        {item.name}
                                        <span className="text-md"><FaSortDown /></span>
                                    </div>
                                    {dropdownUnitBusiness && (
                                        <div className="ml-4 mt-2">
                                            {item.dropdown.map((subItem, subIndex) => (
                                                <a 
                                                    key={subIndex}
                                                    href={subItem.link} 
                                                    className="block py-2 text-white text-lg font-normal hover:text-gray-300"
                                                >
                                                    {subItem.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <a href={item.link} className="font-medium text-white text-xl block py-2">{item.name}</a>
                            )}
                        </div>
                    ))}
                    <div className="flex flex-row items-center gap-4 text-white font-medium mt-4">
                        <h3 className="cursor-pointer" onClick={toggleLanguage}>
                            {language === "id" ? "ind" : "eng"}
                        </h3>
                        <h3 className="cursor-pointer" onClick={toggleLanguage}>
                            {language === "id" ? "eng" : "ind"}
                        </h3>
                    </div>
                </div>
            )}
        </div>
    )
};

export default Header;