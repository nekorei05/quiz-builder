import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";

const AccuracyChart = ({ data = [] }) => (
  <div
    className="bg-card rounded-2xl p-6"
    style={{
      border: "1px solid hsl(var(--border))",
      boxShadow: "var(--shadow-sm)",
    }}
  >
    <h3 className="font-semibold text-foreground mb-6">
      Student Avg Scores
    </h3>

    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
        />

        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />

        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />

        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
        />

        <Bar
          dataKey="avgScore"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default AccuracyChart;