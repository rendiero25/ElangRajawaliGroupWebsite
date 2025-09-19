import logoErg from "../assets/compro/logoErg.png";
import { IoCall } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { IoTime } from "react-icons/io5";

const Footer = ({footerMenu}) => {

    const mappingMenu = footerMenu.map((item, index) => (
        <a key={index} href={item.link} className="font-normal text-white text-lg">{item.name}</a>
    ))

    const unitBusinessMenu = footerMenu.find((items) => items.name === 'Unit Bisnis')?.dropdown || [];
    console.log(unitBusinessMenu);
    const mappingUnitBusinessMenu = unitBusinessMenu.map ((item, index) => (
        <a key={index} href={item.link} className="font-normal text-white text-lg">{item.name}</a>
    ))

    return (
        <div className="bg-gradient-to-b from-comproPrimary to-comproSecondary h-auto">
            <div className="font-primary m-0 p-0 box-border container mx-auto px-6 flex flex-col justify-between items-center gap-10 lg:gap-14 pt-10 lg:pt-20 pb-5 lg:pb-10">
                <div className="flex flex-wrap justify-between items-end gap-6 w-full">
                    <div className="flex flex-col justify-between items-start gap-2">
                        <img src={logoErg} alt="Logo ERG" className="w-30 object-cover"/>
                        <p className="font-normal text-white text-lg max-w-xs">Berfokus pada aspek industri pertahanan, keamanan dan teknologi.</p>
                    </div>

                    <div className="flex flex-col justify-between items-start gap-2">
                        <div className="flex flex-row justify-between items-center gap-4">
                            <IoCall className="text-white size-5"/>
                            <p className="text-white font-normal text-lg">021-3871 1047</p>
                        </div>
                        <div className="flex flex-row justify-between items-center gap-4">
                            <IoLogoWhatsapp className="text-white size-5"/>
                            <p className="text-white font-normal text-lg">0851-8318-0032</p>
                        </div>
                        <div className="flex flex-row justify-between items-center gap-4">
                            <IoMail className="text-white size-5"/>
                            <p className="text-white font-normal text-lg">marketing@elangrajawaligroup.com</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between items-start gap-2">
                        <div className="flex flex-row justify-between items-center gap-4">    
                            <IoLocationSharp className="text-white size-18 lg:size-6 -ml-1"/>
                            <p className="text-white font-normal text-lg max-w-md">Graha ERG, Jl. Raya Pekayon No.17, RT.002 RW.020, Pekayon Jaya, Bekasi Selatan, Bekasi, West Java 17148</p>
                        </div>
                        <div className="flex flex-row justify-between items-center gap-4">
                            <IoTime className="text-white size-5"/>
                            <p className="text-white font-normal text-lg">Senin – Jumat 08:00 – 17:00</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-between items-center gap-6 w-full">
                    <div className="flex flex-wrap lg:flex-row justify-center lg:justify-between items-center text-center font-medium gap-4">
                        {mappingMenu}
                    </div>

                    <div className="flex flex-wrap lg:flex-row justify-center lg:justify-between items-center text-center font-medium gap-4">
                        {mappingUnitBusinessMenu}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-20 mt-10 lg:mt-0">
                    <p className="text-white font-normal text-sm lg:text-md">© 2025 ERG. All rights reserved.</p>
                    <div className="flex flex-wrap justify-between items-center gap-6 text-white font-normal text-sm lg:text-md underline">
                        <a href="#" className="_blank">Privacy Policy</a>
                        <a href="#" className="_blank">Terms of Use</a>
                        <a href="#" className="_blank">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;