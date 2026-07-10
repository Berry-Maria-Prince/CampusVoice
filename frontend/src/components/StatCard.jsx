// export default function StatCard({
function StatCard({
  label,
  value,
  icon: Icon,
  accent = "indigo",
}) {
  const accentMap = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300",

    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",

    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",

    rose:
      "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300",
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-center gap-4 shadow-sm transition-colors">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentMap[accent]}`}
      >
        {Icon && <Icon size={22} />}
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">
          {value}
        </p>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}
export default StatCard;