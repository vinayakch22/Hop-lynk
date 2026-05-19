import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#14b8a6', '#0ea5e9', '#f59e0b', '#22c55e', '#ef4444', '#64748b', '#94a3b8', '#cbd5e1'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-(--card) border border-(--border) rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-medium text-(--text-primary)">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }}>{payload[0].value} clicks</p>
    </div>
  );
};

const DonutChart = ({ data, title }) => {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-(--text-secondary) mb-4">{title}</h3>
      {!data || data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-(--text-muted) text-sm">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export const BrowserChart = ({ data }) => <DonutChart data={data} title="Browsers" />;
export const DeviceChart = ({ data }) => <DonutChart data={data} title="Devices" />;
