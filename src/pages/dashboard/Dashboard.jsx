import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Overview from './Overview';
import CompanyProfile from './CompanyProfile';
import News from './News';

const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1">
                <Routes>
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/company-profile" element={<CompanyProfile />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/" element={<Navigate to="/admin/overview" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;