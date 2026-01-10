import React, { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function RecruitmentLetter() {
  const token = useMemo(() => localStorage.getItem("adminToken"), []);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [letterId, setLetterId] = useState("");
  // toast
  const [toast, setToast] = useState({ show: false, text: "" });
  const toastTimerRef = useRef(null);
  const showToast = (text) => {
    setToast({ show: true, text });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast({ show: false, text: "" }), 2000);
  };
  // jobseeker picker
  const [jsSearch, setJsSearch] = useState("");
  const [jsLoading, setJsLoading] = useState(false);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [data, setData] = useState({
    jobSeekerId: "",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    letterRefNo: "",
    issueDate: "",
    candidateName: "",
    candidateAddress: "",
    candidateEmail: "",
    subject: "",
    positionTitle: "",
    department: "",
    startDate: "",
    employmentType: "Full-time",
    workLocation: "On-site",
    officeAddress: "",
    salaryAmount: "",
    salaryFrequency: "per month",
    probationPeriod: "",
    workingHours: "",
    reportingTo: "",
    extraTerms: "",
    hrName: "",
    hrTitle: "",
  });
  const onChange = (key) => (e) => setData((p) => ({ ...p, [key]: e.target.value }));
  // load jobseekers (search)
  const fetchJobSeekers = async (search) => {
    if (!token) return;
    try {
      setJsLoading(true);
      const res = await axios.get(`${API_BASE}/api/admin/jobseekers`, {
        headers,
        params: { search: search || "" },
      });
      setJobSeekers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      showToast(e?.response?.data?.message || "Failed to load jobseekers ");
    } finally {
      setJsLoading(false);
    }
  };
  useEffect(() => {
    fetchJobSeekers("");
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (data.salaryFrequency !== "per month") {
      setData((p) => ({ ...p, salaryFrequency: "per month" }));
    }
  }, [data.salaryFrequency]);
  const selectJobSeeker = (js) => {
    setData((p) => ({
      ...p,
      jobSeekerId: js._id,
      candidateName: js.name || "",
      candidateEmail: js.email || "",
      salaryFrequency: "per month", // ✅ keep fixed
    }));
    showToast("JobSeeker selected ");
  };
  const validate = () => {
    if (!token) return showToast("Admin token missing "), false;
    const required = [
      ["jobSeekerId", "JobSeeker (select)"],
      ["companyName", "Company Name"],
      ["letterRefNo", "Ref No"],
      ["issueDate", "Issue Date"],
      ["candidateName", "Job Seeker Name"],
      ["positionTitle", "Position Title"],
      ["hrName", "HR Name"],
      ["hrTitle", "HR Title"],
    ];
    for (const [k, label] of required) {
      if (!String(data[k] || "").trim()) {
        showToast(`${label} required `);
        return false;
      }
    }
    return true;
  };
  const handleSave = async () => {
    if (!validate()) return;
    const payload = { ...data, salaryFrequency: "per month" };
    try {
      setSaving(true);
      if (!letterId) {
        const res = await axios.post(`${API_BASE}/api/admin/recruitment-letters`, payload, { headers });
        setLetterId(res.data?._id || "");
        showToast("Saved  ");
      } else {
        await axios.put(`${API_BASE}/api/admin/recruitment-letters/${letterId}`, payload, { headers });
        showToast("Updated ");
      }
    } catch (e) {
      console.error(e);
      showToast(e?.response?.data?.message || "Save failed ");
    } finally {
      setSaving(false);
    }
  };
  const handlePublish = async () => {
    if (!token) return showToast("Admin token missing ");
    if (!letterId) return showToast("Save first ");
    try {
      setPublishing(true);
      await axios.post(`${API_BASE}/api/admin/recruitment-letters/${letterId}/publish`, {}, { headers });
      showToast("Sent to Job Seeker ");
    } catch (e) {
      console.error(e);
      showToast(e?.response?.data?.message || "Publish failed ");
    } finally {
      setPublishing(false);
    }
  };
  const issueDatePretty = useMemo(() => prettyDate(data.issueDate), [data.issueDate]);
  return (
    <div className="min-h-screen bg-slate-50">
      {toast.show ? (
        <div className="fixed right-4 top-4 z-50">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
            <div className="text-xs text-slate-600">{toast.text}</div>
          </div>
        </div>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Recruitment Letter</h1>
            {letterId ? (
              <div className="mt-1 text-xs text-slate-500">
                Letter ID: <span className="font-mono">{letterId}</span>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Letter"}
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing || !letterId}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {publishing ? "Sending..." : "Send to Job Seeker"}
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Letter Details</h2>
            {/* Jobseeker picker */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="w-full">
                  <div className="mb-1 text-xs font-semibold text-slate-700">Find JobSeeker</div>
                  <input
                    value={jsSearch}
                    onChange={(e) => setJsSearch(e.target.value)}
                    placeholder="Search by name/email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>
                <button
                  onClick={() => fetchJobSeekers(jsSearch)}
                  disabled={jsLoading}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {jsLoading ? "Searching..." : "Search"}
                </button>
              </div>
              <div className="mt-3 max-h-48 overflow-auto rounded-xl border border-slate-200 bg-white">
                {jobSeekers.length === 0 ? (
                  <div className="p-3 text-sm text-slate-600">No jobseekers found.</div>
                ) : (
                  jobSeekers.map((js) => (
                    <button
                      key={js._id}
                      onClick={() => selectJobSeeker(js)}
                      className={[
                        "w-full border-b border-slate-100 p-3 text-left hover:bg-slate-50",
                        data.jobSeekerId === js._id ? "bg-slate-50" : "",
                      ].join(" ")}
                    >
                      <div className="text-sm font-semibold text-slate-900">{js.name || "—"}</div>
                      <div className="text-xs text-slate-600">{js.email || "—"}</div>
                      <div className="text-[11px] text-slate-500">ID: {js._id}</div>
                    </button>
                  ))
                )}
              </div>
              <div className="mt-3 text-xs text-slate-700">
                Selected JobSeeker ID:{" "}
                <span className="font-mono">{data.jobSeekerId ? data.jobSeekerId : "None"}</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Company Name" value={data.companyName} onChange={onChange("companyName")} />
              <Input label="Company Email" value={data.companyEmail} onChange={onChange("companyEmail")} />
              <Input label="Company Phone" value={data.companyPhone} onChange={onChange("companyPhone")} />
              <Input label="Ref No" value={data.letterRefNo} onChange={onChange("letterRefNo")} />
              <Input label="Issue Date" value={data.issueDate} onChange={onChange("issueDate")} />
              <Input label="Start Date" value={data.startDate} onChange={onChange("startDate")} />
              <div className="md:col-span-2">
                <Textarea label="Company Address" value={data.companyAddress} onChange={onChange("companyAddress")} />
              </div>
              <h3 className="mt-2 md:col-span-2 text-sm font-bold text-slate-900">Job Seeker Information</h3>
              <Input label="Job Seeker Name" value={data.candidateName} onChange={onChange("candidateName")} />
              <Input label="Job Seeker Email" value={data.candidateEmail} onChange={onChange("candidateEmail")} />
              <div className="md:col-span-2">
                <Textarea label="Job Seeker Address" value={data.candidateAddress} onChange={onChange("candidateAddress")} />
              </div>
              <h3 className="mt-2 md:col-span-2 text-sm font-bold text-slate-900">Letter Subject</h3>
              <div className="md:col-span-2">
                <Input label="Subject" value={data.subject} onChange={onChange("subject")} />
              </div>
              <h3 className="mt-2 md:col-span-2 text-sm font-bold text-slate-900">Job Offer</h3>
              <Input label="Position Title" value={data.positionTitle} onChange={onChange("positionTitle")} />
              <Input label="Department" value={data.department} onChange={onChange("department")} />
              <Select
                label="Employment Type"
                value={data.employmentType}
                onChange={onChange("employmentType")}
                options={["Full-time", "Part-time", "Contract", "Internship"]}
              />
              <Select
                label="Work Location"
                value={data.workLocation}
                onChange={onChange("workLocation")}
                options={["On-site", "Hybrid", "Remote"]}
              />
              <Input label="Salary Amount" value={data.salaryAmount} onChange={onChange("salaryAmount")} />
              {/*  Salary Frequency fixed  */}
              <Input label="Salary Frequency" value={"per month"} onChange={() => {}} readOnly />
              <Input label="Probation Period" value={data.probationPeriod} onChange={onChange("probationPeriod")} />
              <Input label="Working Hours" value={data.workingHours} onChange={onChange("workingHours")} />
              <Input label="Reporting To" value={data.reportingTo} onChange={onChange("reportingTo")} />
              <div className="md:col-span-2">
                <Textarea label="Office Address" value={data.officeAddress} onChange={onChange("officeAddress")} />
              </div>
              <div className="md:col-span-2">
                <Textarea label="Additional Text" value={data.extraTerms} onChange={onChange("extraTerms")} rows={6} />
              </div>
              <h3 className="mt-2 md:col-span-2 text-sm font-bold text-slate-900">HR</h3>
              <Input label="HR Name" value={data.hrName} onChange={onChange("hrName")} />
              <Input label="HR Title" value={data.hrTitle} onChange={onChange("hrTitle")} />
            </div>
          </div>
          {/* RIGHT PREVIEW */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Preview (Letter Format)</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="p-6 sm:p-8">
                <LetterTemplate data={data} issueDatePretty={issueDatePretty} />
                <div className="mt-8 flex justify-end">
                  <div className="w-[260px]">
                    <div className="h-10 border-b-2 border-slate-900" />
                    <div className="mt-1 text-center text-xs text-slate-900">Signature</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/*  Components  */
function LetterTemplate({ data, issueDatePretty }) {
  const line = (v) => (v && String(v).trim() ? String(v).trim() : "");
  const has = (v) => Boolean(line(v));
  const subject = has(data.subject) ? data.subject : "Recruitment Letter";

  return (
    <div className="text-slate-900">
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xl font-extrabold">{data.companyName || "—"}</div>
        {has(data.companyAddress) ? (
          <div className="mt-1 whitespace-pre-line text-sm text-slate-700">{data.companyAddress}</div>
        ) : null}
        {has(data.companyPhone) || has(data.companyEmail) ? (
          <div className="mt-1 text-sm text-slate-700">
            {has(data.companyPhone) ? <span>{data.companyPhone}</span> : null}
            {has(data.companyPhone) && has(data.companyEmail) ? <span className="px-2">•</span> : null}
            {has(data.companyEmail) ? <span>{data.companyEmail}</span> : null}
          </div>
        ) : null}
        <div className="mt-3 text-sm text-slate-700">
          <div>
            <span className="font-semibold text-slate-900">Ref:</span> {data.letterRefNo || "—"}
          </div>
          <div>
            <span className="font-semibold text-slate-900">Date:</span> {issueDatePretty || "—"}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="text-lg font-extrabold uppercase tracking-wide">Recruitment Letter</div>
      </div>
      <div className="mt-6 text-sm leading-6">
        <div className="font-bold">To,</div>
        <div className="mt-1 font-semibold">{data.candidateName || "Job Seeker Name"}</div>
        {has(data.candidateAddress) ? <div className="whitespace-pre-line text-slate-700">{data.candidateAddress}</div> : null}
        {has(data.candidateEmail) ? <div className="text-slate-700">{data.candidateEmail}</div> : null}
      </div>
      <div className="mt-4 text-sm">
        <span className="font-bold">Subject:</span> <span className="font-semibold">{subject}</span>
      </div>
      <div className="mt-5 space-y-4 text-sm leading-6 text-slate-800">
        <p>Dear <span className="font-semibold">{data.candidateName || "Job Seeker"}</span>,</p>
        <p>
          We are pleased to offer you the position of{" "}
          <span className="font-semibold">{data.positionTitle || "—"}</span>
          {has(data.department) ? <> in the <span className="font-semibold">{data.department}</span> department</> : null}{" "}
          at <span className="font-semibold">{data.companyName || "our company"}</span>.
        </p>
        {has(data.employmentType) || has(data.workLocation) ? (
          <p>
            Your employment will be on <span className="font-semibold">{data.employmentType || "—"}</span> basis and
            your work arrangement will be <span className="font-semibold">{data.workLocation || "—"}</span>.
          </p>
        ) : null}
        <div>
          <div className="font-semibold text-slate-900">Offer Details:</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {has(data.startDate) ? <li>Start Date: {prettyDate(data.startDate)}</li> : null}
            {has(data.salaryAmount) || has(data.salaryFrequency) ? (
              <li>
                Salary: {data.salaryAmount || "—"} {data.salaryFrequency ? `(${data.salaryFrequency})` : "(per month)"}
              </li>
            ) : null}
            {has(data.probationPeriod) ? <li>Probation Period: {data.probationPeriod}</li> : null}
            {has(data.workingHours) ? <li>Working Hours: {data.workingHours}</li> : null}
            {has(data.reportingTo) ? <li>Reporting To: {data.reportingTo}</li> : null}
            {has(data.officeAddress) ? <li>Office Address: {data.officeAddress}</li> : null}
          </ul>
        </div>
        {has(data.extraTerms) ? <p className="whitespace-pre-line">{data.extraTerms}</p> : null}
        <p>We look forward to welcoming you to our team.</p>
      </div>

      <div className="mt-10 text-sm">
        <div className="font-semibold">Sincerely,</div>
        <div className="mt-4 font-bold">{data.hrName || "—"}</div>
        <div className="text-slate-700">{data.hrTitle || "—"}</div>
        <div className="text-slate-700">{data.companyName || "—"}</div>
      </div>
    </div>
  );
}
function Input({ label, type = "text", value, onChange, readOnly = false }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-700">{label}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={[
          "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400",
          readOnly ? "cursor-not-allowed bg-slate-50 text-slate-700" : "",
        ].join(" ")}
      />
    </label>
  );
}
function Textarea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-700">{label}</div>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
      />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-700">{label}</div>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}
function prettyDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
