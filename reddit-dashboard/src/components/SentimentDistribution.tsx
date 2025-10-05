import { Cell, Pie, PieChart, ResponsiveContainer, Sector, type SectorProps } from 'recharts';
import type { Comment } from '../services/api';

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: any;
};

interface SentimentDistributionProps {
    data: Comment[];
}

type PieSectorDataItem = React.SVGProps<SVGPathElement> & Partial<SectorProps> & PieSectorData;

// Custom colors for sentiment categories
const COLORS = {
  Positive: '#4ade80', // green
  Negative: '#f87171', // red
  Neutral: '#93c5fd'   // blue
};

const renderActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {

  return (
    <g>
      <text x={cx} y={cy} dy={-15} textAnchor="middle" fill="#fff" className="text-sm font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#fff" className="text-lg font-bold">
        {value} ({(percent! * 100).toFixed(0)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
    </g>
  );
};

export default function SentimentDistribution({ data }: SentimentDistributionProps ) {

    const summedData = data.reduce((allSentiments, comment: Comment) => {
        const sentimentKey = comment.sentiment_label.toLowerCase() as 'positive' | 'negative' | 'neutral';
        allSentiments[sentimentKey] += 1
        return allSentiments;

    }, {positive: 0, negative: 0, neutral: 0});
    
    const chartData = [
        {name: 'Positive', value: summedData.positive},
        {name: 'Negative', value: summedData.negative},
        {name: 'Neutral', value: summedData.neutral},
    ];



    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    activeShape={renderActiveShape}
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[entry.name as keyof typeof COLORS]} 
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
