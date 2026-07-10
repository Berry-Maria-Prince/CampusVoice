import React from "react";

export default function FAQ() {
  const faqs = [
    { q: "How do I submit a complaint?", a: "Go to the 'New Complaint' page, fill in the title, category, and description, then click Submit." },
    { q: "Can I edit or delete my complaint?", a: "Yes, as long as it has not been fully processed, you can edit or delete your complaint from the History page." },
    { q: "How will I know if my complaint is resolved?", a: "The status of your complaint on the History page will change to 'Resolved' once the admin has addressed the issue. You will also receive an email and in-app notification." },
    { q: "Can I submit feedback about the application?", a: "Yes, you can visit the Feedback page from the sidebar to provide suggestions or feedback." },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-slate-800 dark:text-white">{faq.q}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
