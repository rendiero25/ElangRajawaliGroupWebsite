import { useState, useEffect } from 'react';

const NewsForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        title: '',
        subtitle: ''
    });

    // Load existing data on component mount
    useEffect(() => {
        const loadNewsData = async () => {
            try {
                const response = await fetch('/api/companyprofile/section/news');
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.success && result.data) {
                        setFormData({
                            title: result.data.title || '',
                            subtitle: result.data.subtitle || ''
                        });
                    }
                } else if (response.status === 404) {
                    // No data found, start with empty form - this is expected for first time
                    console.log('No existing news data found, starting fresh');
                } else {
                    console.error('Error loading news data:', response.status);
                }
            } catch (error) {
                console.log('Could not load existing news data, starting fresh:', error.message);
            }
        };

        // Add a small delay to ensure backend is ready
        setTimeout(loadNewsData, 1000);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            console.log('Sending news data:', formData);
            const response = await fetch('/api/companyprofile/section/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: 'Data berhasil disimpan!'
                });
                console.log('News section updated:', result.data);
            } else {
                throw new Error(result.error || 'Failed to update news section');
            }
        } catch (error) {
            console.error('Error updating news section:', error);
            setMessage({
                type: 'error',
                text: 'Gagal memperbarui news section. Silakan coba lagi.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">News Section</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                {/* Message */}
                {message.text && (
                    <div className={`p-4 rounded-md mb-4 ${
                        message.type === 'success' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {message.text}
                    </div>
                )}

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter news section title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle
                    </label>
                    <textarea
                        id="subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        placeholder="Enter news section subtitle"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 rounded-md font-medium cursor-pointer ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        } text-white transition-colors`}
                    >
                        {isLoading ? 'Menyimpan...' : 'Update News Section'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewsForm;
