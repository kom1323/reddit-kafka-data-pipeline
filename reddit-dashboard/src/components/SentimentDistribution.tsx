import { Cell, Pie, PieChart, ResponsiveContainer, Sector, type SectorProps } from 'recharts';
import type { Comment } from '../services/api';
import { SENTIMENT_COLORS, type SentimentLabel } from '../services/constants';

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
        const sentimentKey = comment.sentiment_label.toLowerCase() as 'very negative' | 'negative' | 'neutral' | 'positive' | 'very positive';
        allSentiments[sentimentKey] += 1
        return allSentiments;

    }, {'very negative': 0, negative: 0, neutral: 0, positive: 0, 'very positive': 0});
    
    const chartData = [
        {name: 'Very Negative', value: summedData['very negative']},
        {name: 'Negative', value: summedData.negative},
        {name: 'Neutral', value: summedData.neutral},
        {name: 'Positive', value: summedData.positive},
        {name: 'Very Positive', value: summedData['very positive']},

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
                            fill={SENTIMENT_COLORS[entry.name as SentimentLabel]} 
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
