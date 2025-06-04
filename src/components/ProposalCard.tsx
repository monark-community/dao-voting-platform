
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { Proposal, User } from '@/types/governance';

interface ProposalCardProps {
  proposal: Proposal;
  currentUser: User;
  onVote: (proposalId: string, choice: 'for' | 'against') => void;
  onViewDetails: (proposal: Proposal) => void;
}

const ProposalCard = ({ proposal, currentUser, onVote, onViewDetails }: ProposalCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="status-active">Active</Badge>;
      case 'pending': return <Badge className="status-pending">Pending</Badge>;
      case 'completed': return <Badge className="status-completed">Completed</Badge>;
      case 'failed': return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Failed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const quorumProgress = (totalVotes / proposal.quorumRequired) * 100;
  
  const hasUserVoted = proposal.voters.includes(currentUser.address);
  const canVote = proposal.status === 'active' && !hasUserVoted;
  
  const daysLeft = Math.ceil((new Date(proposal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="proposal-card group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
            {proposal.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {proposal.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>by {proposal.proposer.slice(0, 8)}...</span>
            <span>•</span>
            <span>{proposal.category}</span>
          </div>
        </div>
        {getStatusBadge(proposal.status)}
      </div>

      <div className="space-y-4">
        {/* Voting Results */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-400">For: {proposal.votesFor}</span>
            <span className="text-red-400">Against: {proposal.votesAgainst}</span>
          </div>
          <div className="voting-progress">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
              style={{ width: `${forPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{forPercentage.toFixed(1)}% approval</span>
            <span>{totalVotes} total votes</span>
          </div>
        </div>

        {/* Quorum Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Quorum Progress</span>
            <span className="text-gray-400">{Math.min(quorumProgress, 100).toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(quorumProgress, 100)} className="h-2" />
          <div className="text-xs text-gray-500">
            {proposal.quorumRequired} votes required
          </div>
        </div>

        {/* Time Left */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            {daysLeft > 0 ? `${daysLeft} days left` : 'Voting ended'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-slate-700">
          {canVote && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onVote(proposal.id, 'for')}
                className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Vote For
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onVote(proposal.id, 'against')}
                className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Vote Against
              </Button>
            </>
          )}
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDetails(proposal)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>

        {hasUserVoted && (
          <div className="text-center text-sm text-blue-400 bg-blue-500/10 py-2 rounded border border-blue-500/30">
            ✓ You have voted on this proposal
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
