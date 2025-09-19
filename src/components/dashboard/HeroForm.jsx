import { useState, useEffect } from 'react';

const HeroForm = () => {
    const [formData, setFormData] = useState({
        backgroundVideo: '',
        subtitle: '',
        title: '',
        description: '',
        button: '',
        textButton: '',
        infoSideButton: ''
    });
    
    const [videoFile, setVideoFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Load existing data on component mount
    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const response = await fetch('/api/companyprofile/section/hero');
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setFormData(prev => ({
                            ...prev,
                            title: result.data.title || '',
                            subtitle: result.data.subtitle || '',
                            description: result.data.description || '',
                            button: result.data.button || '',
                            textButton: result.data.textButton || '',
                            infoSideButton: result.data.infoSideButton || '',
                            backgroundVideo: result.data.backgroundVideo || ''
                        }));
                    }
                } else if (response.status === 404) {
                    // Hero section doesn't exist yet, that's fine
                    console.log('Hero section not found, will create new one');
                }
            } catch (error) {
                console.error('Error loading hero section:', error);
                setMessage('Error loading existing data');
            }
        };

        fetchHeroData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('video/')) {
                setVideoFile(file);
                // Create a temporary URL for preview or storage reference
                const videoUrl = URL.createObjectURL(file);
                setFormData(prev => ({
                    ...prev,
                    backgroundVideo: file.name // Store filename for now
                }));
                setMessage('');
            } else {
                setMessage('Please select a valid video file.');
                e.target.value = '';
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            // Prepare FormData for file upload
            const formDataToSend = new FormData();
            
            // Add all text fields (website and section are handled by backend)
            formDataToSend.append('subtitle', formData.subtitle);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('button', formData.button);
            formDataToSend.append('textButton', formData.textButton);
            formDataToSend.append('infoSideButton', formData.infoSideButton);
            
            // Add video file if uploaded
            if (videoFile) {
                formDataToSend.append('backgroundVideo', videoFile);
            } else {
                formDataToSend.append('backgroundVideo', formData.backgroundVideo);
            }

            const response = await fetch('/api/companyprofile/section/hero', {
                method: 'POST',
                body: formDataToSend // Don't set Content-Type header, let browser set it for FormData
            });

            if (response.ok) {
                const result = await response.json();
                setMessage('Data berhasil disimpan!');
                console.log('Saved data:', result);
            } else {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                setMessage('Gagal menyimpan data. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Hero Section</h3>
            
            {message && (
                <div className={`p-3 rounded mb-4 ${
                    message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="backgroundVideo" className="block text-sm font-medium text-gray-700 mb-1">
                        Background Video
                    </label>
                    <input
                        type="file"
                        id="backgroundVideo"
                        name="backgroundVideo"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.backgroundVideo && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-2">
                                {videoFile ? `Selected: ${formData.backgroundVideo}` : 'Current video:'}
                            </p>
                            {!videoFile && formData.backgroundVideo.startsWith('/uploads/') && (
                                <video 
                                    src={`http://localhost:5000${formData.backgroundVideo}`}
                                    controls
                                    className="w-full max-w-md h-32 object-cover rounded border"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Subtitle
                    </label>
                    <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter subtitle"
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter title"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter description"
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="button" className="block text-sm font-medium text-gray-700 mb-1">
                        Button URL
                    </label>
                    <input
                        type="url"
                        id="button"
                        name="button"
                        value={formData.button}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                    />
                </div>

                <div>
                    <label htmlFor="textButton" className="block text-sm font-medium text-gray-700 mb-1">
                        Button Text
                    </label>
                    <input
                        type="text"
                        id="textButton"
                        name="textButton"
                        value={formData.textButton}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Learn More"
                    />
                </div>

                <div>
                    <label htmlFor="infoSideButton" className="block text-sm font-medium text-gray-700 mb-1">
                        Info Side Button
                    </label>
                    <input
                        type="text"
                        id="infoSideButton"
                        name="infoSideButton"
                        value={formData.infoSideButton}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Additional info"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md font-medium cursor-pointer ${
                        isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    } text-white transition-colors`}
                >
                    {isLoading ? 'Menyimpan...' : 'Update Hero Section'}
                </button>
            </form>
        </div>
    );
};

export default HeroForm;
