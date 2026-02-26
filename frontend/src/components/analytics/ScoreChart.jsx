import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip, ResponsiveContainer} from "recharts";

const ScoreChart = ({ data = [] }) => (
  <div
    className="bg-card rounded-2xl p-6"
    style={{
      border: "1px solid hsl(var(--border))",
      boxShadow: "var(--shadow-sm)",
    }}
  >
    <h3 className="font-semibold text-foreground mb-6">
      Score Trend
    </h3>

    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
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

        <Line
          type="monotone"
          dataKey="score"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 4, fill: "hsl(var(--primary))" }}
        />

        <Line
          type="monotone"
          dataKey="accuracy"
          stroke="hsl(var(--info))"
          strokeWidth={2}
          dot={{ r: 4, fill: "hsl(var(--info))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ScoreChart;
