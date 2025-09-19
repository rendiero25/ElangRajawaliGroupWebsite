import axios from 'axios';
import { useState, useEffect } from 'react';
import { Grid } from 'ldrs/react';
import 'ldrs/react/Grid.css';

const Newssec = () => {

    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api/companyprofile/section/news';

    const fetchNews = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log(response.data.data);
            setNews(response.data.data);
            setLoading(false);
            setError(null);
        }
        catch (error) {
            console.error('Error fetching data : ' + error);
            setError('Gagal muat data, silahkan coba lagi');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    if (loading) return <Grid size="60" speed="1.5" color="black"></Grid>;
    if (error) return <p>{error}</p>;
    if (!news) return <p>No data available</p>;

    return (
        <div className='container mx-auto px-6'>
            <div className='flex flex-col lg:flex-row justify-between items-start gap-8'>
                <div className='flex flex-wrap justify-between items-center'>
                    <div className='w-[300px] h-[426px] bg-gradient-to-b from-comproPrimary to-comproSecondary flex justify-start items-end px-8 pb-8'>
                        <h2 className='text-3xl font-medium text-white leading-normal'>{news.title}</h2>
                    </div>
                </div>

                <div className='flex flex-col justify-start items-center gap-8 mt-8 w-full'>
                    <h2 className='text-6xl font-medium text-comproPrimary w-full leading-tight'>{news.subtitle}</h2>
                
                    {/* News Slider */}

                </div>
            </div>            
        </div>
    );
};

export default Newssec;
