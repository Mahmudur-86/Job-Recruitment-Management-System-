

export default function CompanyProfile({ setCurrentPage, profile, setProfile }) {
  return (
    <div className="min-h-screen bg-gray-100">
     
      <div className="container mx-auto p-8">
        <button onClick={() => setCurrentPage('dashboard')} className="mb-4 text-blue-600 hover:underline">
          ← Back to Dashboard
        </button>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Company Profile</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert('Profile saved!'); }}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Company Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">HR Contact</label>
              <input
                type="text"
                value={profile.hrContact}
                onChange={(e) => setProfile({...profile, hrContact: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Website</label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({...profile, website: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Logo URL</label>
              <input
                type="text"
                value={profile.logo}
                onChange={(e) => setProfile({...profile, logo: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}