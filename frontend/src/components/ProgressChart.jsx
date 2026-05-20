import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ProgressChart({ title, data }) {
  return (
    <div className="card">
      <h2>{title}</h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="calories" fill="#1677ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProgressChart;