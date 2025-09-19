import HeroSec from "../../components/company-profile/HeroSec";
import NewsSec from "../../components/company-profile/NewsSec";

const Home = () => {
    return (
        <div className="font-primary flex flex-col gap-30">
            <HeroSec/>
            <div className="-mt-30 mb-30">
                <NewsSec/>
            </div>
        </div>
    );
};

export default Home;