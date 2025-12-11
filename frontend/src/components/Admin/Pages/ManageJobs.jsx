import React from 'react';

export default function ManageJobs() {
  const jobs = [
    {
_id: "1",
 jobTitle: "Backend Developer",
 company: "EconoTech",
 location: "Gulshan, Dhaka",
 category:"Full-time",
 salary: "Negotiable",
 description: "Looking for an experienced backend developer",
 
requirements:"Node.js, Express, MongoDB",
vacancies: 2,

interviewmcq: 
       "What is the primary function of a backend developer?",
      option: [
        "1. Designing the user interface",
        "2. Writing server-side logic and APIs",
        "3. Managing front-end frameworks",
        "4. Creating the visual design of the website",
      ],
    






    }
   
  ];

  return (
    <div >
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Manage Jobs</h3>
      <p className="text-gray-600 mb-6">Admin can see all job posts and delete jobs if necessary.</p>
      <div className="bg-white rounded-sm  ">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company </th>
             
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>

 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>

<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary </th>


<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>

<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requirements</th>



<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vacancies</th>

<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">See Interview Question</th>

<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>





              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>


          </thead>



          <tbody className="divide-y divide-gray-200">
            {jobs.map(job => (
              <tr key={job.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.jobTitle}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.company}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.location}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.category}</td>

 <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.salary}</td>
  <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.description}</td>

  <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.requirements}</td>

  <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.vacancies}</td>

<td className="px-6 py-4 text-sm font-medium text-gray-900">{job.interviewmcq}

  {job.option}
</td>




                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-yellow-600 ">Pending</button>


                 
                </td>
                <td className="px-6 py-4 text-sm space-x-2"  >
  <button className="text-green-600 ">Approve</button>
  <button className="text-red-900 ">Reject</button>
                  <button className="text-red-600 ">Delete</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
