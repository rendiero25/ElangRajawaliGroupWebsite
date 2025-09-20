import axios from "axios";
import { useState, useEffect } from "react";
import { Grid } from "ldrs/react";
import 'ldrs/react/Grid.css';

const AboutUsSec = () => {

    const [aboutus, setAboutUs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api/companyprofile/section/aboutus';

    const fetchAboutUs = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log(response.data.data);
            setAboutUs(response.data.data);
            setLoading(false);
            setError(null);
        }
        catch (error) {
            console.error('Error fetching data section about us : ' + error);
            setError('Gagal muat data, silahkan coba lagi');
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAboutUs();
    }, []);

    if (loading) return <Grid size="60" speed="1.5" color="black"></Grid>;
    if (error) return <p>{error}</p>;
    if (!aboutus) return <p>No data about us section available</p>;

    return (
        <div 
        className="relative w-full min-h-auto" 
        style={{backgroundImage: `url('http://localhost:5000${aboutus.backgroundImage}')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        }}>
            <div className="w-full h-full pb-20 px-6">
                <div className="h-full">
                    <div className="container mx-auto px-6 h-full">
                        <div className="flex flex-wrap justify-start items-center gap-12">
                            <div className="w-[425px] h-[531px]">
                                <img src={`http://localhost:5000${aboutus.image}`} alt="aboutus-image" className="shadow-2xl"/>
                            </div>

                            <div className="flex flex-col justify-start items-start gap-4 w-fit self-end">
                                <h3 className="text-xl font-medium text-white">{aboutus.subtitle}</h3>
                                <h3 className="text-5xl font-medium text-white max-w-4xl leading-normal">{aboutus.title}</h3>
                                <p className="text-lg font-normal text-white max-w-4xl">{aboutus.description}</p>
                                <button className="bg-comproPrimary text-white font-medium text-lg px-6 py-2">{aboutus.buttonText}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>
    );
};

export default AboutUsSec;