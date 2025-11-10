import JobCard from "./JobCard.jsx";

const jobs = [
 
  {
    company: "Asta.It",
    tag: "Engineer",
    title: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
      
  },
  {
    company: "SoftZingo",
    tag: "Designer",
    title: "UI/UX Designer",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
  },

];

export default function JobGrid() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-8 py-14 sm:grid-cols-2 lg:grid-cols-3  ">
      {jobs.map((j) => (
        <JobCard key={j.title} {...j} />
      ))}
    </section>
  );
}
