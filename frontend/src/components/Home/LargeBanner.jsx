// LargeBanner.jsx
export default function LargeBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      
      <img
        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1470&auto=format&fit=crop"
        alt="People collaborating in a modern office – job recruitment"
        className="h-95 w-full object-cover `"
      />

      
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Find Your Dream Career Job
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Thousands of  companies are hiring right now.
          </p>
        </div>
      </div>
    </section>
  );
}