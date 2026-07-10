import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#FBBF24", "#3B82F6", "#10B981"];

export default function StatusPieChart({ complaints }) {
  const data = [
    {
      name: "Pending",
      value: complaints.filter((c) => c.status === "Pending").length,
    },
    {
      name: "In Progress",
      value: complaints.filter((c) => c.status === "In Progress").length,
    },
    {
      name: "Resolved",
      value: complaints.filter((c) => c.status === "Resolved").length,
    },
  ];

  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
        Complaint Status Analysis
      </h2>

      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={95}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
          No status data available yet.
        </div>
      )}
    </div>
  );
}