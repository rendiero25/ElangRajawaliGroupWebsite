import { useState, useEffect } from 'react';

const AboutUsForm = () => {
    const [formData, setFormData] = useState({
        backgroundImage: '',
        image: '',
        title: '',
        subtitle: '',
        description: '',
        buttonText: ''
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Load existing data on component mount
    useEffect(() => {
        const fetchAboutUsData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/companyprofile/section/aboutus');
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setFormData(prev => ({
                            ...prev,
                            backgroundImage: result.data.backgroundImage || '',
                            title: result.data.title || '',
                            subtitle: result.data.subtitle || '',
                            description: result.data.description || '',
                            buttonText: result.data.buttonText || '',
                            image: result.data.image || ''
                        }));
                    }
                } else if (response.status === 404) {
                    // About Us section doesn't exist yet, that's fine
                    console.log('About Us section not found, will create new one');
                }
            } catch (error) {
                console.error('Error loading about us section:', error);
                setMessage('Error loading existing data');
            }
        };

        fetchAboutUsData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBackgroundImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setBackgroundImageFile(file);
                setFormData(prev => ({
                    ...prev,
                    backgroundImage: file.name // Store filename for now
                }));
                setMessage('');
            } else {
                setMessage('Please select a valid image file.');
                e.target.value = '';
            }
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setImageFile(file);
                // Create a temporary URL for preview or storage reference
                const imageUrl = URL.createObjectURL(file);
                setFormData(prev => ({
                    ...prev,
                    image: file.name // Store filename for now
                }));
                setMessage('');
            } else {
                setMessage('Please select a valid image file.');
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
            
            // Add all text fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('subtitle', formData.subtitle);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('buttonText', formData.buttonText);
            
            // Add background image file if uploaded
            if (backgroundImageFile) {
                formDataToSend.append('backgroundImage', backgroundImageFile);
            } else {
                formDataToSend.append('backgroundImage', formData.backgroundImage);
            }
            
            // Add image file if uploaded
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            } else {
                formDataToSend.append('image', formData.image);
            }

            console.log('Sending request to: http://localhost:5000/api/companyprofile/section/aboutus');
            
            const response = await fetch('http://localhost:5000/api/companyprofile/section/aboutus', {
                method: 'POST',
                body: formDataToSend // Don't set Content-Type header, let browser set it for FormData
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            // Check for multiple success indicators like in News.jsx
            if (response.ok || response.status === 200 || response.status === 201) {
                try {
                    const result = await response.json();
                    
                    // Check if response has success indicator
                    if (result.success || response.status === 200 || response.status === 201) {
                        setMessage('Data berhasil disimpan!');
                        console.log('✅ Saved data successfully:', result);
                    } else {
                        console.error('❌ Server response indicates failure:', result);
                        setMessage(result.message || 'Gagal menyimpan data. Silakan coba lagi.');
                    }
                } catch (jsonError) {
                    console.log('✅ Success response but not JSON, assuming success');
                    setMessage('Data berhasil disimpan!');
                }
            } else {
                let errorMessage = 'Gagal menyimpan data';
                
                // Clone response to avoid "body stream already read" error
                const responseClone = response.clone();
                
                try {
                    const errorData = await response.json();
                    console.error('❌ Error response (JSON):', errorData);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (jsonError) {
                    // If JSON parsing fails, try text on cloned response
                    try {
                        const errorText = await responseClone.text();
                        console.error('❌ Error response (Text):', errorText);
                        errorMessage = errorText || errorMessage;
                    } catch (textError) {
                        console.error('❌ Could not parse error response:', textError);
                        errorMessage = `HTTP ${response.status} - ${response.statusText}`;
                    }
                }
                setMessage(`❌ ${errorMessage} (Status: ${response.status})`);
            }
        } catch (error) {
            console.error('❌ Network/Other Error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                setMessage('❌ Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:5000');
            } else {
                setMessage(`❌ Terjadi kesalahan: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">About Us Section</h3>
            
            {message && (
                <div className={`p-3 rounded mb-4 ${
                    message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-700 mb-1">
                        Background Image
                    </label>
                    <input
                        type="file"
                        id="backgroundImage"
                        name="backgroundImage"
                        accept="image/*"
                        onChange={handleBackgroundImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.backgroundImage && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-2">
                                {backgroundImageFile ? `Selected: ${formData.backgroundImage}` : 'Current background image:'}
                            </p>
                            {!backgroundImageFile && formData.backgroundImage.startsWith('/uploads/') && (
                                <img 
                                    src={`http://localhost:5000${formData.backgroundImage}`}
                                    alt="About Us Background"
                                    className="w-full max-w-md h-32 object-cover rounded border"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        Image
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.image && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-2">
                                {imageFile ? `Selected: ${formData.image}` : 'Current image:'}
                            </p>
                            {!imageFile && formData.image.startsWith('/uploads/') && (
                                <img 
                                    src={`http://localhost:5000${formData.image}`}
                                    alt="About Us"
                                    className="w-full  max-w-md h-32 object-cover rounded border"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                    )}
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
                    <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-1">
                        Button Text
                    </label>
                    <input
                        type="text"
                        id="buttonText"
                        name="buttonText"
                        value={formData.buttonText}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Learn More"
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
                    {isLoading ? 'Menyimpan...' : 'Update About Us Section'}
                </button>
            </form>
        </div>
    );
};

export default AboutUsForm;
