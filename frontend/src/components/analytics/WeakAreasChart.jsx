import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";

const WeakAreasChart = ({ data = [] }) => (
  <div className="glass-card p-6">
    <h3 className="font-semibold mb-4 text-sm">
      Weak Areas
    </h3>

    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
        />

        <XAxis
          type="number"
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />

        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
          width={100}
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
          dataKey="errors"
          fill="hsl(var(--destructive))"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default WeakAreasChart;