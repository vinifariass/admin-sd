'use client'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const Charts = ({ data: { vagasData } }: {
    data: {
        vagasData: {
            month: string;
            totalVagas: number;
        }[]
    }
}) => {
    return (<>
        <ResponsiveContainer width='100%' height={350}>
            <BarChart data={vagasData}>
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
                    dataKey='totalVagas'
                    fill='currentColor'
                    radius={[4, 4, 0, 0]}
                    className='fill-primary'
                />
            </BarChart>
        </ResponsiveContainer>
    </>);
}

export default Charts;