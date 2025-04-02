'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts"

const data = [
  { name: "Jan", total: 6000 },
  { name: "Feb", total: 4800 },
  { name: "Mar", total: 3000 },
  { name: "Apr", total: 4000 },
  { name: "May", total: 5800 },
  { name: "Jun", total: 2700 },
  { name: "Jul", total: 5200 },
  { name: "Aug", total: 1600 },
  { name: "Sep", total: 1900 },
  { name: "Oct", total: 4600 },
  { name: "Nov", total: 1700 },
  { name: "Dec", total: 4700 },
]

export default function TotalVendasChart() {
  return (
    <Card className="bg-background col-span-4">
      <CardHeader>
        <CardTitle>Total de Vendas</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: "#f1f1f1" }}
              formatter={(value) => `$${value}`}
            />
            <Bar
              dataKey="total"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
