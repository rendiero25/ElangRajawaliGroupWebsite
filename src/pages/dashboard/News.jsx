import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [message, setMessage] = useState('');

    const API_URL = 'http://localhost:5000/api/news';
    console.log('🔧 API_URL configured as:', API_URL);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setNews(response.data || []);
            setError(null);
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Gagal memuat data berita');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setMessage('Berita berhasil dihapus');
                fetchNews();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                console.error('Error deleting news:', error);
                setError('Gagal menghapus berita');
            }
        }
    };

    const handleEdit = (newsItem) => {
        setEditingNews(newsItem);
        setShowForm(true);
    };

    const handleCloseForm = (successMessage = '') => {
        setShowForm(false);
        setEditingNews(null);
        
        if (successMessage) {
            setMessage(successMessage);
            setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
        }
        
        fetchNews(); // Reload the news list
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        
        // Format as mm-dd-yyyy
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${month}-${day}-${year}`;
    };

    const truncateDescription = (description, maxLength = 100) => {
        if (!description) return 'No description';
        
        // Remove HTML tags and metadata
        let cleanDescription = description
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/data-metadata="[^"]*"/g, '') // Remove data-metadata
            .replace(/&lt;!--\(figmeta\)[^>]*--&gt;/g, '') // Remove figma metadata
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .trim();
            
        if (cleanDescription.length <= maxLength) return cleanDescription;
        return cleanDescription.substring(0, maxLength) + '...';
    };

    if (showForm) {
        return (
            <NewsForm 
                news={editingNews} 
                onClose={handleCloseForm}
                onSuccess={handleCloseForm}
            />
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">News Management</h1>
                <div className="flex gap-2">
                    {/* Test Button - Temporary for debugging */}
                    <button
                        onClick={async () => {
                            try {
                                console.log('🔍 Testing backend connection...');
                                const response = await axios.get(`${API_URL}/test`);
                                console.log('✅ Backend test successful:', response.data);
                                alert('Backend connection successful!');
                            } catch (error) {
                                console.error('❌ Backend test failed:', error);
                                alert(`Backend test failed: ${error.message}`);
                            }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Test Backend
                    </button>
                    
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Berita
                    </button>
                </div>
            </div>

            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit Business
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {news.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            Belum ada berita tersedia
                                        </td>
                                    </tr>
                                ) : (
                                    news.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {item.unitBusiness}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(item.date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs">
                                                    {truncateDescription(item.description)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative">
                                                    {(() => {
                                                        // Convert relative path to full URL
                                                        const getFullImageUrl = (url) => {
                                                            if (!url) return null;
                                                            if (url.startsWith('http')) return url; // Already full URL
                                                            if (url.startsWith('/uploads/')) return `http://localhost:5000${url}`;
                                                            return url;
                                                        };
                                                        
                                                        const imageUrl = getFullImageUrl(item.image);
                                                        const isValidImage = imageUrl && 
                                                                           imageUrl !== 'file-will-be-uploaded' && 
                                                                           imageUrl.trim() !== '';
                                                        
                                                        if (isValidImage) {
                                                            return (
                                                                <div>
                                                                    <img 
                                                                        src={imageUrl} 
                                                                        alt={item.title || 'News image'}
                                                                        className="h-10 w-16 object-cover rounded"
                                                                        onLoad={() => {
                                                                            console.log('✅ Dashboard image loaded:', imageUrl);
                                                                        }}
                                                                        onError={(e) => {
                                                                            console.log('❌ Dashboard image failed:', imageUrl);
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextElementSibling.style.display = 'block';
                                                                        }}
                                                                    />
                                                                    <div 
                                                                        className="text-gray-400 text-xs bg-red-100 rounded p-1 text-center"
                                                                        style={{ display: 'none' }}
                                                                    >
                                                                        Image Error
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                                    <span className="text-gray-400 text-xs">No image</span>
                                                                </div>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// NewsForm component untuk Add/Edit
const NewsForm = ({ news, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: news?.title || '',
        unitBusiness: news?.unitBusiness || '',
        date: news?.date ? new Date(news.date).toISOString().split('T')[0] : '',
        description: news?.description || '',
        image: news?.image || ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(news?.image || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = 'http://localhost:5000/api/news';
    
    const businessUnits = [
        'Global Ekapaksi Lestari',
        'Apex Tactix',
        'Mediatama Eka Paksi',
        'Rajawali Abadi Ekapaksi',
        'Bahtera Kharisma Abadi'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // If image URL is being changed, update preview
        if (name === 'image' && value) {
            setImagePreview(value);
            setImageFile(null); // Clear file if URL is being used
        } else if (name === 'image' && !value) {
            setImagePreview(null);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('=== FRONTEND SUBMIT ===');
            console.log('FormData:', formData);
            console.log('ImageFile:', imageFile);
            console.log('ImagePreview:', imagePreview);

            // Validate required fields on frontend first
            if (!formData.title || !formData.unitBusiness || !formData.description) {
                setError('Harap lengkapi semua field yang wajib diisi (Title, Unit Business, Description)');
                return;
            }

            let response;
            
            if (imageFile) {
                // Handle file upload using FormData
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title.trim());
                formDataToSend.append('unitBusiness', formData.unitBusiness.trim());
                formDataToSend.append('description', formData.description.trim());
                formDataToSend.append('date', formData.date || new Date().toISOString().split('T')[0]);
                formDataToSend.append('image', imageFile);

                console.log('📤 Sending FormData with file:', {
                    title: formData.title.trim(),
                    unitBusiness: formData.unitBusiness.trim(),
                    description: formData.description.trim(),
                    date: formData.date || new Date().toISOString().split('T')[0],
                    imageFile: imageFile.name
                });

                if (news?._id) {
                    // Update existing news with file
                    console.log('🔄 Updating existing news with file:', news._id);
                    response = await axios.put(`${API_URL}/${news._id}`, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } else {
                    // Create new news with file (use main endpoint, not /simple)
                    console.log('➕ Creating new news with file');
                    console.log('📁 Using endpoint:', API_URL);
                    response = await axios.post(API_URL, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                }
            } else {
                // Handle text/URL data using JSON
                const dataToSend = {
                    title: formData.title.trim(),
                    unitBusiness: formData.unitBusiness.trim(),
                    description: formData.description.trim(),
                    date: formData.date || new Date().toISOString().split('T')[0],
                    image: formData.image?.trim() || ''
                };

                console.log('📤 Sending JSON data:', dataToSend);

                if (news?._id) {
                    // Update existing news 
                    console.log('🔄 Updating existing news:', news._id);
                    response = await axios.put(`${API_URL}/${news._id}`, dataToSend, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } else {
                    // Create new news
                    console.log('➕ Creating new news');
                    
                    // First test basic connectivity
                    try {
                        console.log('🔍 Testing connectivity to:', `${API_URL}/test`);
                        const testResponse = await axios.get(`${API_URL}/test`);
                        console.log('✅ Test endpoint working:', testResponse.data);
                    } catch (testError) {
                        console.error('❌ Test endpoint failed:', testError);
                        console.error('❌ Status:', testError.response?.status);
                        console.error('❌ Status Text:', testError.response?.statusText);
                        console.error('❌ Response Data:', testError.response?.data);
                        throw new Error(`Backend server error: ${testError.response?.status} ${testError.response?.statusText}. URL: ${API_URL}/test`);
                    }
                    
                    response = await axios.post(`${API_URL}/simple`, dataToSend, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
            }

            console.log('✅ Server Response:', response.data);
            
            // Check if response indicates success
            if (response.data && (response.data.success === true || response.status === 200 || response.status === 201)) {
                console.log('🎉 News saved successfully to MongoDB!');
                
                // Try to get document ID if available
                const documentId = response.data.data?._id || response.data._id || 'N/A';
                console.log('📄 Document ID:', documentId);
                
                // Show success message
                const successMessage = news?._id ? 'Berita berhasil diperbarui!' : 'Berita berhasil disimpan ke database!';
                console.log('✅', successMessage);
                
                onSuccess(successMessage);
            } else {
                // More detailed error handling
                const errorMessage = response.data?.error || 
                                   response.data?.message || 
                                   `Server returned status ${response.status}: ${response.statusText}` ||
                                   'Unknown error occurred';
                console.error('❌ Server error details:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: response.data
                });
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error saving news:', error);
            
            // More detailed error logging
            console.error('❌ Full error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
            
            // Better error message for user
            let userErrorMessage = 'Terjadi kesalahan saat menyimpan berita';
            
            if (error.response) {
                // Server responded with error status
                const serverError = error.response.data?.error || 
                                  error.response.data?.message || 
                                  error.response.statusText;
                userErrorMessage = `Server Error (${error.response.status}): ${serverError}`;
            } else if (error.request) {
                // Network error
                userErrorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
            } else {
                // Other error
                userErrorMessage = `Error: ${error.message}`;
            }
            
            setError(userErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    {news?._id ? 'Edit Berita' : 'Tambah Berita Baru'}
                </h1>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Image Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Foto Berita
                    </label>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mb-4">
                            <div className="relative inline-block">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* File Input */}
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="imageUpload"
                        />
                        <label
                            htmlFor="imageUpload"
                            className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-100 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {imagePreview ? 'Ganti Foto' : 'Pilih Foto'}
                        </label>
                        
                        {/* Alternative: Image URL Input */}
                        <span className="text-gray-400">atau</span>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan URL gambar"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Pilih file gambar dari komputer atau masukkan URL gambar
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan judul berita"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Business *
                    </label>
                    <select
                        name="unitBusiness"
                        value={formData.unitBusiness}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Pilih Unit Business</option>
                        {businessUnits.map((unit) => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal *
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description/Artikel *
                    </label>
                    <div className="border border-gray-300 rounded-md">
                        <RichTextEditor 
                            value={formData.description}
                            onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                            placeholder="Tulis artikel berita di sini..."
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Gunakan toolbar di atas untuk format teks (bold, italic, bullet points, dll.)
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 cursor-pointer text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : (news?._id ? 'Update' : 'Simpan')}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder }) => {
    const [content, setContent] = useState(value || '');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const editorRef = useRef(null);

    useEffect(() => {
        setContent(value || '');
    }, [value]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
        }
        
        // Update button states
        setIsBold(document.queryCommandState('bold'));
        setIsItalic(document.queryCommandState('italic'));
        setIsUnderline(document.queryCommandState('underline'));
    };

    const handleContentChange = (e) => {
        const newContent = e.target.innerHTML;
        setContent(newContent);
        if (onChange) {
            onChange(newContent);
        }
    };

    const handleKeyUp = () => {
        // Update button states when cursor moves
        setIsBold(document.queryCommandState('bold'));
        setIsItalic(document.queryCommandState('italic'));
        setIsUnderline(document.queryCommandState('underline'));
    };

    const handleKeyDown = (e) => {
        // Handle Enter key to create proper line breaks
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            
            // Insert line break at cursor position
            const br1 = document.createElement('br');
            const br2 = document.createElement('br');
            
            range.insertNode(br2);
            range.insertNode(br1);
            
            // Move cursor after the line breaks
            range.setStartAfter(br2);
            range.setEndAfter(br2);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Trigger content change
            const event = new Event('input', { bubbles: true });
            editorRef.current.dispatchEvent(event);
        }
    };

    const increaseFontSize = () => {
        // Get current selection
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            
            if (selectedText) {
                // Check if already in a span with font size
                let parentElement = range.commonAncestorContainer.parentElement;
                if (parentElement && parentElement.style && parentElement.style.fontSize) {
                    // Increase existing font size
                    const currentSize = parseFloat(parentElement.style.fontSize) || 1;
                    parentElement.style.fontSize = Math.min(currentSize + 0.2, 2.5) + 'em';
                } else {
                    // Wrap selected text with larger font
                    const span = document.createElement('span');
                    span.style.fontSize = '1.2em';
                    span.innerHTML = selectedText;
                    range.deleteContents();
                    range.insertNode(span);
                }
            } else {
                // If no selection, use document command for future typing
                document.execCommand('fontSize', false, '4');
            }
        }
        
        // Trigger content change to save state
        if (editorRef.current) {
            const event = new Event('input', { bubbles: true });
            editorRef.current.dispatchEvent(event);
            editorRef.current.focus();
        }
    };

    const decreaseFontSize = () => {
        // Get current selection
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            
            if (selectedText) {
                // Check if already in a span with font size
                let parentElement = range.commonAncestorContainer.parentElement;
                if (parentElement && parentElement.style && parentElement.style.fontSize) {
                    // Decrease existing font size
                    const currentSize = parseFloat(parentElement.style.fontSize) || 1;
                    const newSize = Math.max(currentSize - 0.2, 0.7);
                    if (newSize <= 1) {
                        // Remove font size if it's back to normal or smaller
                        parentElement.style.fontSize = '';
                        if (!parentElement.style.cssText) {
                            // If no other styles, unwrap the element
                            parentElement.outerHTML = parentElement.innerHTML;
                        }
                    } else {
                        parentElement.style.fontSize = newSize + 'em';
                    }
                } else {
                    // Wrap selected text with smaller font
                    const span = document.createElement('span');
                    span.style.fontSize = '0.85em';
                    span.innerHTML = selectedText;
                    range.deleteContents();
                    range.insertNode(span);
                }
            } else {
                // If no selection, use document command for future typing
                document.execCommand('fontSize', false, '2');
            }
        }
        
        // Trigger content change to save state
        if (editorRef.current) {
            const event = new Event('input', { bubbles: true });
            editorRef.current.dispatchEvent(event);
            editorRef.current.focus();
        }
    };

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden relative">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                <select 
                    onChange={(e) => execCommand('formatBlock', e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                    defaultValue=""
                >
                    <option value="">Format</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="p">Paragraph</option>
                </select>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className={`px-2 py-1 text-sm border border-gray-300 rounded font-bold ${
                        isBold ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'
                    }`}
                    title="Bold"
                >
                    B
                </button>
                
                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    className={`px-2 py-1 text-sm border border-gray-300 rounded italic ${
                        isItalic ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'
                    }`}
                    title="Italic"
                >
                    I
                </button>
                
                <button
                    type="button"
                    onClick={() => execCommand('underline')}
                    className={`px-2 py-1 text-sm border border-gray-300 rounded underline ${
                        isUnderline ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'
                    }`}
                    title="Underline"
                >
                    U
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100"
                    title="Bullet List"
                >
                    • List
                </button>
                
                <button
                    type="button"
                    onClick={() => execCommand('insertOrderedList')}
                    className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100"
                    title="Numbered List"
                >
                    1. List
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Font Size Controls */}
                <button
                    type="button"
                    onClick={increaseFontSize}
                    className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100"
                    title="Increase Font Size"
                >
                    A+
                </button>
                
                <button
                    type="button"
                    onClick={decreaseFontSize}
                    className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100"
                    title="Decrease Font Size"
                >
                    A-
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) execCommand('createLink', url);
                    }}
                    className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100"
                    title="Insert Link"
                >
                    🔗 Link
                </button>
            </div>

            {/* Editor Container */}
            <div className="relative">
                {/* Placeholder text when empty */}
                {!content && (
                    <div className="absolute top-3 left-3 text-gray-400 pointer-events-none z-10">
                        {placeholder}
                    </div>
                )}
                
                {/* Editor */}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={handleContentChange}
                    onKeyUp={handleKeyUp}
                    onKeyDown={handleKeyDown}
                    className="min-h-[200px] max-h-[400px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset overflow-y-auto block"
                    style={{ 
                        minHeight: '200px',
                        maxHeight: '400px',
                        lineHeight: '1.5'
                    }}
                    dangerouslySetInnerHTML={{ __html: content || '' }}
                />
            </div>
        </div>
    );
};

export default News;
