// JobGrid.jsx
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
    deadline: "2025-12-31",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    company: "SoftZingo",
    tag: "Designer",
    title: "UI/UX Designer",
    location: "Remote",
    department: "Design",
    salary: "40k - 60k",
    deadline: "2025-11-30",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
  },
];

export default function JobGrid({ onApply }) {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-8 py-14 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((j) => (
        <JobCard
          key={j.id}
          {...j}
          onApply={() => onApply && onApply(j)}
        />
      ))}
    </section>
  );
}
