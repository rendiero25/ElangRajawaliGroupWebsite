import HeroSec from "../../components/company-profile/HeroSec";
import NewsSec from "../../components/company-profile/NewsSec";
import AboutUsSec from "../../components/company-profile/AboutUsSec";
import WhyUsSec from "../../components/company-profile/WhyUsSec";


const Home = () => {
    return (
        <div className="font-primary flex flex-col gap-30">
            <HeroSec/>
            <div className="-mt-30">
                <NewsSec/>
            </div>
            <AboutUsSec/>
            <div className="-mt-30">
                <WhyUsSec/>
            </div>
        </div>
    );
};

export default Home;