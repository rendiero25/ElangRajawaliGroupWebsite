import axios from 'axios';
import { useState, useEffect } from 'react';
import { Grid } from 'ldrs/react';
import 'ldrs/react/Grid.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

const Newssec = () => {

    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newsContent, setNewsContent] = useState([]);

    const API_URL = 'http://localhost:5000/api/companyprofile/section/news';
    const API_URL_CONTENT = 'http://localhost:5000/api/news';

    // Fetch news section
    const fetchNews = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log(response.data.data);
            setNews(response.data.data);
            setLoading(false);
            setError(null);
        }
        catch (error) {
            console.error('Error fetching data section news : ' + error);
            setError('Gagal muat data, silahkan coba lagi');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // Fetch news content
    const fetchNewsContent = async () => {
        try {
            const response = await axios.get(API_URL_CONTENT);
            console.log('=== NEWS CONTENT RESPONSE ===');
            console.log('Response data:', response.data);
            
            // Handle different response structures
            let newsData = [];
            if (Array.isArray(response.data)) {
                newsData = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                newsData = response.data.data;
            } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
                newsData = response.data.data;
            } else {
                console.warn('Unexpected response structure:', response.data);
                newsData = [];
            }
            
            // Debug image URLs
            console.log('=== IMAGE URL DEBUG ===');
            newsData.forEach((item, index) => {
                console.log(`News ${index + 1}:`, {
                    title: item.title,
                    image: item.image,
                    imageType: typeof item.image,
                    imageLength: item.image?.length,
                    isValidUrl: item.image && item.image.startsWith('http'),
                    originalItem: item
                });
                
                // Test if localhost is accessible
                if (item.image && item.image.includes('localhost:5000')) {
                    console.log('🧪 Testing backend accessibility...');
                    fetch('http://localhost:5000/api/news/test')
                        .then(response => {
                            console.log('✅ Backend is accessible:', response.status);
                        })
                        .catch(error => {
                            console.error('❌ Backend not accessible:', error);
                        });
                }
            });
            
            console.log('Final news data:', newsData);
            setNewsContent(newsData);
            setLoading(false);
            setError(null);
        }
        catch (error) {
            console.error('Error fetching news content:', error);
            setError('Gagal memuat berita, silakan coba lagi');
            setNewsContent([]);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNewsContent();
    }, []);

    if (loading) return <Grid size="60" speed="1.5" color="black"></Grid>;
    if (error) return <p>{error}</p>;
    if (!news) return <p>No data news section available</p>;
    if (!newsContent || (Array.isArray(newsContent) && newsContent.length === 0)) {
        return (
            <div className="container mx-auto px-6">
                <p className="text-center text-gray-500 py-8">Tidak ada berita tersedia</p>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-6 w-full overflow-hidden'>
            <div className='flex flex-col lg:flex-row justify-between items-start gap-8 w-full'>
                <div className='flex flex-wrap justify-between items-center lg:flex-shrink-0'>
                    <div className='w-[300px] h-[426px] bg-gradient-to-b from-comproPrimary to-comproSecondary flex justify-start items-end px-8 pb-8'>
                        <h2 className='text-3xl pr-10 font-medium text-white leading-normal'>{news.title}</h2>
                    </div>
                </div>

                <div className='flex flex-col justify-start items-start gap-8 mt-8 w-full overflow-hidden'>
                    <h2 className='text-5xl font-medium text-comproPrimary max-w-5xl leading-tight'>{news.subtitle}</h2>

                    {/* Header with Navigation */}
                    <div className='flex flex-row justify-between items-center mb-7 w-full max-w-full'>
                        <a href="#" className='font-medium text-lg text-comproPrimary flex-shrink-0'>Lihat semua</a>
                        
                        {/* Custom Navigation */}
                        <div className='flex flex-row gap-4 flex-shrink-0'>
                            <button className='swiper-button-prev-custom text-comproPrimary text-lg font-medium'>
                                Prev
                            </button>
                            <button className='swiper-button-next-custom text-comproPrimary text-lg font-medium'>
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Swiper Container */}
                    <div className='w-full max-w-full overflow-hidden relative -mt-10'>
                        {/* News Slider */}
                        <div className='w-full max-w-full'>
                            <Swiper
                                    modules={[Navigation]}
                                    navigation={{
                                        prevEl: '.swiper-button-prev-custom',
                                        nextEl: '.swiper-button-next-custom',
                                    }}
                                    slidesPerView={1}
                                    spaceBetween={0}
                                    className="w-full max-w-full"
                                    style={{ maxWidth: '100%', overflow: 'hidden' }}
                                >
                            {(() => {
                                // Convert relative path to full URL
                                const getFullImageUrl = (url) => {
                                    if (!url) return '';
                                    if (url.startsWith('http')) return url; // Already full URL
                                    if (url.startsWith('/uploads/')) return `http://localhost:5000${url}`;
                                    return url;
                                };
                                
                                // Format date to mm/dd/yyyy
                                const formatDate = (dateString) => {
                                    if (!dateString) return 'No date';
                                    const date = new Date(dateString);
                                    if (isNaN(date.getTime())) return 'Invalid date';
                                    
                                    // Format as mm/dd/yyyy
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const year = date.getFullYear();
                                    
                                    return `${month}/${day}/${year}`;
                                };

                                // Group news into chunks of 5
                                const newsChunks = [];
                                const chunkSize = 5;
                                for (let i = 0; i < newsContent.length; i += chunkSize) {
                                    newsChunks.push(newsContent.slice(i, i + chunkSize));
                                }

                                console.log('News chunks:', newsChunks.length, 'slides with', chunkSize, 'items each');

                                return newsChunks.map((chunk, slideIndex) => (
                                    <SwiperSlide key={`slide-${slideIndex}`}>
                                        <div className='flex flex-row gap-4 w-full max-w-full overflow-hidden justify-between'>
                                            {chunk.map((item, index) => {
                                                const imageUrl = getFullImageUrl(item.image);
                                                const formattedDate = formatDate(item.date);
                                                
                                                console.log(`Slide ${slideIndex + 1}, News ${index + 1}:`, {
                                                    originalImage: item.image,
                                                    processedImage: imageUrl,
                                                    formattedDate: formattedDate
                                                });
                                                
                                                return (
                                                    <div 
                                                        key={`${slideIndex}-${index}`}
                                                        className='flex flex-col justify-between items-center overflow-hidden relative text-white cursor-pointer' 
                                                        style={{
                                                            backgroundImage: imageUrl ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${imageUrl})` : 'linear-gradient(to bottom, #e5e7eb, #9ca3af)',
                                                            width: 'calc((100% - 64px) / 5)',
                                                            minWidth: '160px',
                                                            height: '315px', 
                                                            backgroundSize: 'cover', 
                                                            backgroundPosition: 'center', 
                                                            backgroundRepeat: 'no-repeat',
                                                            flex: '1 1 auto'
                                                        }}
                                                    >
                                                        <div className='px-2 text-xs font-medium bg-comproPrimary w-20 h-20 text-center justify-center items-center self-end'>
                                                            <div className='flex justify-center items-center w-full h-full'>
                                                                {formattedDate}
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-col justify-end items-start p-4 w-full'>
                                                            <div className='text-xl font-bold mb-2 text-ellipsis overflow-hidden'>
                                                                {item.title || 'No Title'}
                                                            </div>
                                                            <div className='text-sm'>
                                                                {item.unitBusiness || 'No Unit'}
                                                            </div>
                                                        </div>
                                                        {/* Fallback for no image */}
                                                        {!imageUrl && (
                                                            <div className='absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-600'>
                                                                <svg className='w-12 h-12' fill='currentColor' viewBox='0 0 20 20'>
                                                                    <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd'/>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </SwiperSlide>
                                ));
                            })()}
                                </Swiper>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    );
};

export default Newssec;
