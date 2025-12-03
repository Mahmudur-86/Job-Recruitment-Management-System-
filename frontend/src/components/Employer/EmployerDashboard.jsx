import { useState } from 'react';

import NavBar from './NavBar';
import Dashboard from './Dashboard';
import CompanyProfile from './CompanyProfile';
import PostJob from './PostJob';
import AllJobs from './AllJobs';
import ViewApplications from './ViewApplications';
import StudentInternList from './StudentInternList';
import StudentInternshipAlert from './StudentInternshipAlert';
import EmailModal from './EmailModal';

export default function EmployerDashboard({ onLogout }) {

  const [currentPage, setCurrentPage] = useState('dashboard');

  //  CLEAN: Applications now EMPTY (no dummy)
  const [applications] = useState([]);

  // Jobs posted by employer
  const [jobs, setJobs] = useState([]);

  // Students (dummy data)
  const [students] = useState([
    { id: 1, name: 'Hamid Khan', university: 'IUBAT', score: 95, cv: 'cv_hamid.pdf', major: 'BSc in CSE ' },
   
  ]);

  // Email modal control
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Company profile info
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    companyContact: ''
  });

  // Internship alert info
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
    <div className="min-h-screen bg-gray-100">
      <NavBar onLogout={onLogout} />

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

        {currentPage === 'alljobs' && (
          <AllJobs 
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
    </div>
  );
}
