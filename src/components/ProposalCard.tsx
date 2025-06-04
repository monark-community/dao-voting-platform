
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
      case 'active': return <Badge className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 font-medium">Active</Badge>;
      case 'pending': return <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 font-medium">Pending</Badge>;
      case 'completed': return <Badge className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 font-medium">Completed</Badge>;
      case 'failed': return <Badge className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 font-medium">Failed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getProposerUsername = (address: string) => {
    // Generate consistent usernames based on address
    const usernames = {
      '0xabcdef1234567890': 'Alice42',
      '0x9876543210fedcba': 'Bob_dev',
      '0x5678901234abcdef': 'Charlie_gov',
      '0x1111222233334444': 'Diana_eco',
      '0x5555666677778888': 'Eve_proto',
      '0x9999aaaabbbbcccc': 'Frank_dao',
      '0xddddeeeeffffaaaa': 'Grace_sys',
      '0xbbbbccccddddeeee': 'Henry_net'
    };
    return usernames[address] || 'Anonymous';
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
          <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
            {proposal.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {proposal.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>
              by {getProposerUsername(proposal.proposer)} <span className="text-gray-400 font-normal">{proposal.proposer.slice(0, 8)}...</span>
            </span>
            <span>•</span>
            <span className="capitalize">{proposal.category}</span>
          </div>
        </div>
        {getStatusBadge(proposal.status)}
      </div>

      <div className="space-y-4">
        {/* Voting Results */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">For: {proposal.votesFor}</span>
            <span className="text-red-600 font-medium">Against: {proposal.votesAgainst}</span>
          </div>
          <div className="voting-progress">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
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
            <span className="text-gray-600">Quorum Progress</span>
            <span className="text-gray-600">{Math.min(quorumProgress, 100).toFixed(1)}%</span>
          </div>
          <Progress value={Math.min(quorumProgress, 100)} className="h-2" />
          <div className="text-xs text-gray-500">
            {proposal.quorumRequired} votes required
          </div>
        </div>

        {/* Time Left */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>
            {daysLeft > 0 ? `${daysLeft} days left` : 'Voting ended'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {canVote && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onVote(proposal.id, 'for')}
                className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Vote For
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onVote(proposal.id, 'against')}
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
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
          <div className="text-center text-sm text-blue-600 bg-blue-50 py-2 rounded border border-blue-200">
            ✓ You have voted on this proposal
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
