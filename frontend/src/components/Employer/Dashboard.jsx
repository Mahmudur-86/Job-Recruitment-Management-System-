

export default function Dashboard({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gray-100">
    
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Company Profile', page: 'profile', desc: 'Manage company information', icon: '🏢' },
            { title: 'Post Job', page: 'postjob', desc: 'Create new job posting', icon: '📝' },
            { title: 'All Jobs', page: 'alljobs', desc: 'Edit or delete job posts', icon: '💼' },
            { title: 'View Applications', page: 'applications', desc: 'See all applicants', icon: '📋' },
            { title: 'Student Intern List', page: 'students', desc: 'Browse student profiles', icon: '🎓' },
            { title: 'Internship Alerts', page: 'alerts', desc: 'Send alerts to students', icon: '📢' }
          ].map((feature, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(feature.page)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-left"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}