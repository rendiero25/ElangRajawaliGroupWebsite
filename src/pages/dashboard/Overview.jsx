const Overview = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Overview Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-100 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-blue-800">Total Pages</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-green-800">Active Sections</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">12</p>
                </div>
                <div className="bg-purple-100 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-purple-800">News Articles</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">8</p>
                </div>
            </div>
            
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-600">No recent activities</p>
                </div>
            </div>
        </div>
    );
};

export default Overview;
