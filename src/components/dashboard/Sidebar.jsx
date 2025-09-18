import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    
    const menuItems = [
        { name: 'Overview', path: '/admin/overview', icon: '📊' },
        { name: 'Company Profile', path: '/admin/company-profile', icon: '🏢' },
        { name: 'News', path: '/admin/news', icon: '📰' }
    ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <p className="text-gray-400 text-sm">Elang Rajawali Group</p>
            </div>
            
            <nav>
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                    location.pathname === item.path
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
