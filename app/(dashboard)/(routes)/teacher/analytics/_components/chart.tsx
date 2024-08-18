"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type Props = {
  data: {
    label: string;
    value: number;
  }[];
};

export const Chart: React.FC<Props> = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart className="pt-6" data={data}>
            <XAxis
              dataKey="label"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="value" fill="#0369a1" radius={[4, 4, 0, 0]} barSize={100} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
