
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Vote, TrendingUp, Clock } from 'lucide-react';

interface GovernanceStatsProps {
  totalProposals: number;
  activeProposals: number;
  totalVoters: number;
  participationRate: number;
}

const GovernanceStats = ({ totalProposals, activeProposals, totalVoters, participationRate }: GovernanceStatsProps) => {
  const stats = [
    {
      title: 'Total Proposals',
      value: totalProposals,
      icon: Vote,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Proposals',
      value: activeProposals,
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Total Voters',
      value: totalVoters,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Participation Rate',
      value: `${participationRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="governance-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GovernanceStats;
