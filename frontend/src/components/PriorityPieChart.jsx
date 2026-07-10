import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#EF4444", "#FBBF24", "#10B981"];

export default function PriorityPieChart({ complaints }) {
  const data = [
    {
      name: "High",
      value: complaints.filter((c) => c.priority === "High").length,
    },
    {
      name: "Medium",
      value: complaints.filter((c) => c.priority === "Medium").length,
    },
    {
      name: "Low",
      value: complaints.filter((c) => c.priority === "Low").length,
    },
  ];

  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-colors">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
        Complaint Priority Analysis
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
          No priority data available yet.
        </div>
      )}
    </div>
  );
}