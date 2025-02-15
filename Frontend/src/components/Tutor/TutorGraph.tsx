import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import userAxiosInstance from '../../config/axiosInstance.ts/tutorInstance';

interface ChartData {
  month: string;
  users: number;
  revenue: number;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const MonthlyStats: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await userAxiosInstance.get(`/tutor/chart?year=${year}`);
        const { enrollments, revenue } = data;

        const chartData: ChartData[] = Array.from({ length: 12 }, (_, index) => {
          const enrollmentForMonth = enrollments.find((enrollment: any) => enrollment._id.month === index + 1 && enrollment._id.year === year);
          const revenueForMonth = revenue.find((rev: any) => rev._id.month === index + 1);

          return {
            month: monthNames[index], // Set month name for X-axis
            users: enrollmentForMonth ? enrollmentForMonth.totalUsers : 0,
            revenue: revenueForMonth ? revenueForMonth.totalRevenue : 0,
          };
        });

        setData(chartData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [year]);

  return (
    <div>
      <h2>Monthly Statistics for {year}</h2>

      {/* Year Filter */}
      <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
        <option value={2024}>2024</option>
        <option value={2023}>2023</option>
        <option value={2022}>2022</option>
        <option value={2021}>2021</option>
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(month) => month}
            interval={0} 
            angle={-45} 
            textAnchor="end" 
            tick={{ fontSize: 12 }}  
          />
          {/* Left Y-axis for revenue */}
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#000000" 
            domain={[0, (dataMax: number) => (dataMax > 50000 ? dataMax : 50000)]} 
          />
          {/* Right Y-axis for users with custom ticks */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#82ca9d" 
            domain={[0, 1000]} 
            ticks={[50, 100, 200, 500, 1000]} // Custom scale
          />
          <Tooltip />
          <Legend />
          {/* Bar for revenue */}
          <Bar yAxisId="left" dataKey="revenue" fill="#29c763" />
          {/* Line for users */}
          <Line yAxisId="right" type="monotone" dataKey="users" stroke="#82ca9d" dot={{ r: 3 }} activeDot={{ r: 5 }} /> 
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyStats;