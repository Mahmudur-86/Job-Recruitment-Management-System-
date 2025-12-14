import React from "react";

export default function InternshipAlerts() {
  const internships = [
    {
      company: "EconoTech",
      department: "CSE",
      university: "IUBAT",
      universityMail: "www.iubat.edu.cse",
      position: "MERN Developer Intern",
      duration: "4 months",
      contact: "017879542122",
      status: "Pending",
    },
  ];

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-2 text-gray-800">
        Internship Alerts
      </h3>
      <p className="text-gray-600 mb-6 text-sm">
        Admin verifies and approves employer-submitted internships alerts before
        sending to specific universities.
      </p>

      {/*  Responsive container */}
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        {/*  Horizontal scroll on small devices */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Company Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                  University Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                  University Mail
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {internships.map((intern, idx) => (
                <tr key={intern.id || idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {intern.company}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {intern.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {intern.university}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {intern.universityMail}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[260px]">
                    <div className="wrap-break-word line-clamp-2">{intern.position}</div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {intern.duration}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {intern.contact}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${
                        intern.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {intern.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-3 whitespace-nowrap">
                      <button className="text-green-600 hover:text-green-800">
                        Approve
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        Reject
                      </button>
                      <button className="text-red-800 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*  Mobile hint  */}
      <p className="text-xs text-gray-500 mt-2 sm:hidden">
        Tip: Swipe left/right to see the full table.
      </p>
    </div>
  );
}
