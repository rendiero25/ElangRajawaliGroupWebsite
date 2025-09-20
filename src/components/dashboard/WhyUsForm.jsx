import { useState, useEffect } from 'react';

const WhyUsForm = () => {
    const [formData, setFormData] = useState({
        subtitle: '',
        title: '',
        description: '',
        backgroundImageWhyus: '',
        whyus1Title: '',
        whyus1Description: '',
        whyus2Title: '',
        whyus2Description: '',
        whyus3Title: '',
        whyus3Description: ''
    });
    
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Load existing data on component mount
    useEffect(() => {
        const fetchWhyUsData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/companyprofile/section/whyus');
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setFormData(prev => ({
                            ...prev,
                            subtitle: result.data.subtitle || '',
                            title: result.data.title || '',
                            description: result.data.description || '',
                            backgroundImageWhyus: result.data.backgroundImageWhyus || '',
                            whyus1Title: result.data.whyus1Title || '',
                            whyus1Description: result.data.whyus1Description || '',
                            whyus2Title: result.data.whyus2Title || '',
                            whyus2Description: result.data.whyus2Description || '',
                            whyus3Title: result.data.whyus3Title || '',
                            whyus3Description: result.data.whyus3Description || ''
                        }));
                    }
                } else if (response.status === 404) {
                    // Why Us section doesn't exist yet, that's fine
                    console.log('Why Us section not found, will create new one');
                }
            } catch (error) {
                console.error('Error loading why us section:', error);
                setMessage('Error loading existing data');
            }
        };

        fetchWhyUsData();
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
                    backgroundImageWhyus: file.name
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
            console.log('Sending request to: http://localhost:5000/api/companyprofile/section/whyus');
            
            // Prepare FormData for file upload
            const formDataToSend = new FormData();
            
            console.log('=== FRONTEND FORM DATA ===');
            console.log('Form data:', formData);
            console.log('Background image file:', backgroundImageFile);
            
            // Add all text fields
            formDataToSend.append('subtitle', formData.subtitle || '');
            formDataToSend.append('title', formData.title || '');
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('whyus1Title', formData.whyus1Title || '');
            formDataToSend.append('whyus1Description', formData.whyus1Description || '');
            formDataToSend.append('whyus2Title', formData.whyus2Title || '');
            formDataToSend.append('whyus2Description', formData.whyus2Description || '');
            formDataToSend.append('whyus3Title', formData.whyus3Title || '');
            formDataToSend.append('whyus3Description', formData.whyus3Description || '');
            
            // Add background image file if uploaded
            if (backgroundImageFile) {
                formDataToSend.append('backgroundImageWhyus', backgroundImageFile);
            } else if (formData.backgroundImageWhyus) {
                formDataToSend.append('backgroundImageWhyus', formData.backgroundImageWhyus);
            }
            
            const response = await fetch('http://localhost:5000/api/companyprofile/section/whyus', {
                method: 'POST',
                body: formDataToSend // Don't set Content-Type header, let browser set it for FormData
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            // Check for multiple success indicators like in other forms
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
            <h3 className="text-xl font-semibold mb-4">Why Us Section</h3>
            
            {message && (
                <div className={`p-3 rounded mb-4 ${
                    message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Section Info */}
                <div className="border-b pb-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Informasi Utama</h4>
                    
                    <div className="space-y-4">
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
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter description"
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="backgroundImageWhyus" className="block text-sm font-medium text-gray-700 mb-1">
                                Background Image
                            </label>
                            <input
                                type="file"
                                id="backgroundImageWhyus"
                                name="backgroundImageWhyus"
                                accept="image/*"
                                onChange={handleBackgroundImageUpload}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {formData.backgroundImageWhyus && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {backgroundImageFile ? `Selected: ${formData.backgroundImageWhyus}` : 'Current background image:'}
                                    </p>
                                    {!backgroundImageFile && formData.backgroundImageWhyus.startsWith('/uploads/') && (
                                        <img 
                                            src={`http://localhost:5000${formData.backgroundImageWhyus}`}
                                            alt="Why Us Background"
                                            className="w-full max-w-md h-32 object-cover rounded border"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Why Us 1 */}
                <div className="border-b pb-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Why Us 1</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="whyus1Title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title Why Us 1
                            </label>
                            <input
                                type="text"
                                id="whyus1Title"
                                name="whyus1Title"
                                value={formData.whyus1Title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter whyus 1 title"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="whyus1Description" className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi Why Us 1
                            </label>
                            <textarea
                                id="whyus1Description"
                                name="whyus1Description"
                                value={formData.whyus1Description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter whyus 1 description"
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Why Us 2 */}
                <div className="border-b pb-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Why Us 2</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="whyus2Title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title Why Us 2
                            </label>
                            <input
                                type="text"
                                id="whyus2Title"
                                name="whyus2Title"
                                value={formData.whyus2Title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter whyus 2 title"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="whyus2Description" className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi Why Us 2
                            </label>
                            <textarea
                                id="whyus2Description"
                                name="whyus2Description"
                                value={formData.whyus2Description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter whyus 2 description"
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Why Us 3 */}
                <div className="border-b pb-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Why Us 3</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="whyus3Title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title Why Us 3
                            </label>
                            <input
                                type="text"
                                id="whyus3Title"
                                name="whyus3Title"
                                value={formData.whyus3Title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter whyus 3 title"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="whyus3Description" className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi Why Us 3
                            </label>
                            <textarea
                                id="whyus3Description"
                                name="whyus3Description"
                                value={formData.whyus3Description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter whyus 3 description"
                                required
                            ></textarea>
                        </div>
                    </div>
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
                    {isLoading ? 'Menyimpan...' : 'Save Why Us Section'}
                </button>
            </form>
        </div>
    );
};

export default WhyUsForm;
