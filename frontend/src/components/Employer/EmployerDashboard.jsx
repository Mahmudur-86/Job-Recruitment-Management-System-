import { useState } from 'react';
import NavBar from './NavBar';
import Dashboard from './Dashboard';
import CompanyProfile from './CompanyProfile';
import PostJob from './PostJob';
import ManageJobs from './ManageJobs';
import ViewApplications from './ViewApplications';
import StudentInternList from './StudentInternList';
import StudentInternshipAlert from './StudentInternshipAlert';
import EmailModal from './EmailModal';

export default function EmployerDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Frontend Developer', department: 'IT', applications: 15, salary: '$60k-80k', deadline: '2025-12-01' },
    { id: 2, title: 'Marketing Intern', department: 'Marketing', applications: 8, salary: '$30k-40k', deadline: '2025-11-25' }
  ]);
  const [applications] = useState([
    { id: 1, name: 'John Doe', email: 'john@email.com', cv: 'cv1.pdf', score: 85 },
    { id: 2, name: 'Jane Smith', email: 'jane@email.com', cv: 'cv2.pdf', score: 92 },
    { id: 3, name: 'Mike Johnson', email: 'mike@email.com', cv: 'cv3.pdf', score: 78 }
  ]);
  const [students] = useState([
    { id: 1, name: 'Alice Wang', university: 'MIT', score: 95, cv: 'cv_alice.pdf', major: 'Computer Science' },
    { id: 2, name: 'Bob Johnson', university: 'Stanford', score: 88, cv: 'cv_bob.pdf', major: 'Business' },
    { id: 3, name: 'Carol Lee', university: 'MIT', score: 92, cv: 'cv_carol.pdf', major: 'Engineering' }
  ]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [profile, setProfile] = useState({
    name: 'Tech Corp Inc.',
    address: '123 Silicon Valley, CA 94025',
    hrContact: 'hr@techcorp.com',
    website: 'www.techcorp.com',
    logo: 'https://via.placeholder.com/100'
  });
  const [alert, setAlert] = useState({
    companyName: '',
    department: '',
    university: '',
    role: '',
    duration: '',
    description: '',
    websiteName: ''
  });
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [universityFilter, setUniversityFilter] = useState('');

  return (
    <div>
      {currentPage === 'dashboard' && (
        <Dashboard setCurrentPage={setCurrentPage} />
      )}
      {currentPage === 'profile' && (
        <CompanyProfile 
          setCurrentPage={setCurrentPage} 
          profile={profile} 
          setProfile={setProfile} 
        />
      )}
      {currentPage === 'postjob' && (
        <PostJob 
          setCurrentPage={setCurrentPage} 
          jobs={jobs} 
          setJobs={setJobs} 
        />
      )}
      {currentPage === 'managejobs' && (
        <ManageJobs 
          setCurrentPage={setCurrentPage} 
          jobs={jobs} 
          setJobs={setJobs} 
        />
      )}
      {currentPage === 'applications' && (
        <ViewApplications 
          setCurrentPage={setCurrentPage} 
          applications={applications}
          showEmailModal={showEmailModal}
          setShowEmailModal={setShowEmailModal}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
        />
      )}
      {currentPage === 'students' && (
        <StudentInternList 
          setCurrentPage={setCurrentPage} 
          students={students}
          universityFilter={universityFilter}
          setUniversityFilter={setUniversityFilter}
        />
      )}
      {currentPage === 'alerts' && (
        <StudentInternshipAlert 
          setCurrentPage={setCurrentPage}
          alert={alert}
          setAlert={setAlert}
          isAlertActive={isAlertActive}
          setIsAlertActive={setIsAlertActive}
        />
      )}
      
      {showEmailModal && selectedPerson && (
        <EmailModal 
          person={selectedPerson} 
          onClose={() => setShowEmailModal(false)} 
        />
      )}
    </div>
  );
}