import axios from "axios";
import { useState, useEffect } from "react";
import { Grid } from "ldrs/react";
import 'ldrs/react/Grid.css';

const WhyUsSec = () => {

    const [whyus, setWhyUs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api/companyprofile/section/whyus';
    const BASE_URL = 'http://localhost:5000';

    const fetchWhyUs = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log('API Response:', response.data);
            
            if (response.data && response.data.data) {
                console.log('Why Us data:', response.data.data);
                setWhyUs(response.data.data);
            } else {
                console.error('Unexpected response structure:', response.data);
                setError('Format data tidak valid');
            }
        } catch (error) {
            console.error('Error fetching why us data:', error);
            setError('Gagal memuat data. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWhyUs();
    }, []);

    if (loading) {
        return <Grid size="60" speed="1.5" color="black"></Grid>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!whyus) {
        return <p>Tidak ada data section why us</p>;
    }

    return (
        <div 
            className="relative w-full min-h-auto"
            style={{
                backgroundImage: `url('${BASE_URL}${whyus.backgroundImageWhyus}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'scroll'
            }}
        >
            {/* Content with proper padding */}
            <div className="w-full h-full py-20 px-6">
                <div className="container mx-auto h-full px-6">
                    <div className="flex flex-col justify-center items-center gap-20">
                        <div className="flex flex-col lg:flex-row justify-between items-end w-full">
                            <div className="flex flex-col justify-start items-start gap-4">
                                <h3 className="text-xl font-medium text-white">{whyus.subtitle}</h3>
                                <h3 className="text-5xl font-medium text-comproPrimary max-w-xl leading-tight">{whyus.title}</h3>
                            </div>
                            <p className="text-lg text-white max-w-2xl">{whyus.description}</p>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 w-full">
                            <div className="flex flex-col justify-center items-start gap-4 flex-1">
                                <h3 className="text-2xl text-white font-bold">{whyus.whyus1Title}</h3>
                                <p className="text-white font-light text-2xl">{whyus.whyus1Description}</p>
                            </div>
                            <div className="flex flex-col justify-center items-start gap-4 flex-1">
                                <h3 className="text-2xl text-white font-bold">{whyus.whyus2Title}</h3>
                                <p className="text-white font-light text-2xl">{whyus.whyus2Description}</p>
                            </div>
                            <div className="flex flex-col justify-center items-start gap-4 flex-1">
                                <h3 className="text-2xl text-white font-bold">{whyus.whyus3Title}</h3>
                                <p className="text-white font-light text-2xl">{whyus.whyus3Description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhyUsSec;
