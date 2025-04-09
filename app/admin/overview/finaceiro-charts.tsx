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
const FinanceiroCharts = ({ data: { gastosData } }: {
  data: {
    gastosData: {
      month: string;
      totalGastos: number;
    }[]
  }
}) => {

  return (
    <Card className="bg-background col-span-4">
      <CardHeader>
        <CardTitle>Total de Gastos</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={gastosData}>
            <XAxis
              dataKey='month'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar
              dataKey='totalGastos'
              fill='currentColor'
              radius={[4, 4, 0, 0]}
              className='fill-primary'
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default FinanceiroCharts