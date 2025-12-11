export default function InterviewModal({ person, onClose }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
      <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-xl">

        <h2 className="text-2xl font-bold mb-4">
          Interview Answers from - {person.name}
        </h2>

        <div className="space-y-4">
          {person.interviewAnswers?.map((qa, index) => (
            <div key={index} className="border p-4 rounded-md bg-gray-50">
              <p className="font-semibold">{qa.question}</p>

              <ul className="mt-2 text-sm text-gray-700">
                {qa.options.map((opt, i) => (
                  <li key={i}>
                    {opt === qa.answer ? (
                      <span className="text-green-600 font-bold">✔ {opt}</span>
                    ) : (
                      <span className="text-gray-600">• {opt}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-5 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Close
        </button>

      </div>
    </div>
  );
}
