import React from "react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">About CampusVoice</h1>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4 text-slate-600 dark:text-slate-300 transition-colors">
        <p>CampusVoice is a platform designed to streamline the process of reporting and resolving issues within the campus environment.</p>
        <p>Our goal is to ensure a smooth, transparent, and efficient way for students to raise complaints regarding infrastructure, facilities, and more, while giving administrators the tools they need to track and resolve these issues.</p>
      </div>
    </div>
  );
}
