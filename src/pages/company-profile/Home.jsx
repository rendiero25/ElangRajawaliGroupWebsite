import axios from 'axios';
import { useState, useEffect } from 'react';

const Home = () => {

    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api/companyprofile/section/hero';

    const fetchHero = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log(response.data.data);
            setHero(response.data.data);
            setLoading(false);
            setError(null);
        } catch (error) {
            console.error('Error fetching data : ' + error);
            setError('Gagal muat data, silahkan coba lagi');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHero();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!hero) return <p>No data available</p>;

    return (
        <div className='w-full'>
            <div className='flex flex-col justify-center items-center'>
                <div className='relative w-full h-[550px]'>
                    <div className='absolute w-full h-[550px]'>
                        {hero.backgroundVideo && (
                            <div className='w-full h-[550px]'>
                                <video autoPlay loop muted className='w-full h-full object-cover'>
                                    <source src={`http://localhost:5000${hero.backgroundVideo}`} type='video/mp4'/>
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </div>
                    
                    <div className='container mx-auto px-6 h-full w-full relative mt-25'>
                        <div className='flex flex-col justify-center items-start gap-2 h-full w-full'>
                            <h2 className='text-xl font-normal text-white'>{hero.subtitle}</h2>
                            <h1 className='text-6xl font-medium text-white'>{hero.title}</h1>
                            <p className='text-lg font-normal text-white mt-3'>{hero.description}</p>
                            <div className='flex flex-row justify-between items-center gap-6 mt-3'>
                                <button className='bg-comproPrimary text-white font-medium text-lg px-6 py-2 '>{hero.textButton}</button>
                                <a href="#" className='font-normal text-white text-lg'>{hero.infoSideButton}</a>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    );
};

export default Home;