import React from 'react';

interface RadarChartProps {
  skills: {
    name: string;
    value: number; // 0-100
  }[];
  cefr: string; // e.g., "B2"
  level: string; // e.g., "Upper-Intermediate"
}

export const RadarChart: React.FC<RadarChartProps> = ({ skills, cefr, level }) => {
  const size = 300;
  const center = size / 2;
  const maxValue = 100;
  const radius = 80;
  const levels = 5;

  // Calculate angles for each skill (5 skills form a pentagon)
  const angleSlice = (Math.PI * 2) / skills.length;

  // Convert polar to cartesian coordinates
  const getCoordinates = (value: number, index: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate background circles
  const circles = Array.from({ length: levels }, (_, i) => {
    const r = ((i + 1) / levels) * radius;
    return `M ${center - r} ${center} A ${r} ${r} 0 1 1 ${center - r + 0.1} ${center}`;
  });

  // Generate axis lines
  const axes = skills.map((_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `M ${center} ${center} L ${x} ${y}`;
  });

  // Generate the data polygon path
  const dataPoints = skills.map((skill, i) => {
    const coords = getCoordinates(skill.value, i);
    return `${coords.x},${coords.y}`;
  });
  const dataPath = `M ${dataPoints.join(' L ')} Z`;

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* CEFR Level Selector */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level, idx) => (
          <div
            key={level}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              level === cefr
                ? 'bg-gradient-fluently text-white'
                : 'bg-gray-700 bg-opacity-40 text-gray-400'
            }`}
          >
            {level}
          </div>
        ))}
      </div>

      {/* Radar Chart SVG */}
      <svg width={size} height={size} className="drop-shadow-lg">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(268 87% 43% / 0.6)" />
            <stop offset="100%" stopColor="hsl(268 87% 43% / 0.2)" />
          </linearGradient>
        </defs>

        {/* Background circles */}
        {circles.map((path, i) => (
          <path
            key={`circle-${i}`}
            d={path}
            stroke="hsl(0 0% 100% / 0.1)"
            fill="none"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axes.map((path, i) => (
          <path
            key={`axis-${i}`}
            d={path}
            stroke="hsl(0 0% 100% / 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon */}
        <path d={dataPath} fill="url(#radarGradient)" stroke="hsl(268 87% 43%)" strokeWidth="2" />

        {/* Data points */}
        {skills.map((_, i) => {
          const coords = getCoordinates(skills[i].value, i);
          return (
            <circle
              key={`point-${i}`}
              cx={coords.x}
              cy={coords.y}
              r="4"
              fill="hsl(195 100% 50%)"
              stroke="hsl(268 87% 43%)"
              strokeWidth="2"
            />
          );
        })}

        {/* Center label background */}
        <circle cx={center} cy={center} r="40" fill="hsl(261 100% 10%)" opacity="0.8" />

        {/* CEFR Text */}
        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          className="fill-cyan-400 font-bold text-sm"
          fontSize="20"
        >
          {cefr}
        </text>
        <text
          x={center}
          y={center + 16}
          textAnchor="middle"
          className="fill-gray-400 text-xs"
          fontSize="12"
        >
          {level}
        </text>
      </svg>

      {/* Skill Labels */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mt-4">
        {skills.map((skill) => (
          <div key={skill.name} className="text-center">
            <p className="text-cyan-400 font-bold text-lg">{skill.value}%</p>
            <p className="text-gray-400 text-xs mt-1">{skill.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
