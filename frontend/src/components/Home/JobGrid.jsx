import React, { useState } from "react";
import JobCard from "./JobCard.jsx";

const jobs = [
  {
    id: 1,
    company: "Asta IT",
    tag: "Engineer",
    title: "Software Engineer",
    location: "Dhaka, Bangladesh",
    department: "Software Development",
    salary: "50k - 70k",
    
  },
  {
    id: 2,
    company: "SoftZingo",
    tag: "Designer",
    title: "UI/UX Designer",
    location: "Banani, Dhaka, Bangladesh",
    department: "Design",
    salary: "40k - 60k",
   
  },
  // More jobs can be added here for testing
  {
    id: 3,
    company: "TechDyno",
    tag: "Developer",
    title: "Full Stack Developer",
    location: "Gulshan, Dhaka, Bangladesh",
    department: "Development",
    salary: "60k - 80k",
    
  },
  {
    id: 4,
    company: "DevSolutions",
    tag: "Engineer",
    title: "Backend Engineer",
    location: "Mohakhali, Dhaka, Bangladesh",
    department: "Engineering",
    salary: "55k - 75k",
   
  },
];

export default function JobGrid({ onApply }) {
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore); // Toggle to show more or less jobs
  };

  // Determine which jobs to display based on the "showMore" state
  const displayedJobs = showMore ? jobs : jobs.slice(0, 2); // Initially show only 2 jobs

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-8 py-14 sm:grid-cols-2 lg:grid-cols-3">
      {displayedJobs.map((j) => (
        <JobCard
          key={j.id}
          {...j}
          onApply={() => onApply && onApply(j)}
        />
      ))}
      <div className="col-span-3 flex justify-center mt-6">
        <button
          onClick={handleShowMore}
          className="rounded-xl bg-green-800 px-8 py-3 text-lg text-white shadow transition hover:bg-cyan-400"
        >
          {showMore ? "Show Less" : "See More Jobs"}
        </button>
      </div>
    </section>
  );
}
