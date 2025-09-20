import { useState } from 'react';
import HeroForm from '../../components/dashboard/HeroForm';
import NewsForm from '../../components/dashboard/NewsForm';
import AboutUsForm from '../../components/dashboard/AboutUsForm';
import WhyUsForm from '../../components/dashboard/WhyUsForm';

const CompanyProfile = () => {
    const [selectedSection, setSelectedSection] = useState('hero');
    
    const sections = [
        { id: 'hero', name: 'Hero Section', description: 'Main banner section' },
        { id: 'news', name: 'News Section', description: 'Manage news title and subtitle' },
        { id: 'aboutus', name: 'About Us Section', description: 'Manage about us content' },
        { id: 'whyus', name: 'Why Us', description: 'Manage why us section' }
    ];

    const renderSectionForm = () => {
        switch (selectedSection) {
            case 'hero':
                return <HeroForm />;
            case 'news':
                return <NewsForm />;
            case 'aboutus':
                return <AboutUsForm />;
            case 'whyus':
                return <WhyUsForm />;
            default:
                return (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-gray-600">This section is coming soon.</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Company Profile Management</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Section Selector */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Select Section</h2>
                    <div className="space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setSelectedSection(section.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                                    selectedSection === section.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                }`}
                            >
                                <div className="font-medium">{section.name}</div>
                                <div className={`text-sm ${
                                    selectedSection === section.id ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                    {section.description}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section Form */}
                <div className="lg:col-span-3">
                    {renderSectionForm()}
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;