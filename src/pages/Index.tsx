
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import GovernanceHeader from '@/components/GovernanceHeader';
import GovernanceStats from '@/components/GovernanceStats';
import ProposalCard from '@/components/ProposalCard';
import CreateProposalModal from '@/components/CreateProposalModal';
import { Proposal, User } from '@/types/governance';
import { Search, Filter } from 'lucide-react';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    address: '0x1234567890abcdef',
    role: 'voter',
    tokenBalance: 1500,
    votingPower: 1500
  });

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Increase Block Rewards by 15%',
      description: 'Proposal to increase mining rewards to incentivize network security and participation during the current market conditions.',
      proposer: '0xabcdef1234567890',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      endDate: new Date('2024-01-22'),
      quorumRequired: 25,
      votesFor: 18,
      votesAgainst: 7,
      totalVotes: 25,
      voters: [],
      category: 'protocol'
    },
    {
      id: '2',
      title: 'Community Fund Allocation for Development',
      description: 'Allocate 100,000 GOV tokens from treasury to fund ecosystem development and partnerships.',
      proposer: '0x9876543210fedcba',
      status: 'active',
      createdAt: new Date('2024-01-10'),
      endDate: new Date('2024-01-20'),
      quorumRequired: 30,
      votesFor: 22,
      votesAgainst: 3,
      totalVotes: 25,
      voters: [],
      category: 'treasury'
    },
    {
      id: '3',
      title: 'Governance Parameter Update',
      description: 'Update minimum quorum requirements and extend voting periods to improve participation.',
      proposer: '0x5678901234abcdef',
      status: 'completed',
      createdAt: new Date('2024-01-05'),
      endDate: new Date('2024-01-12'),
      quorumRequired: 20,
      votesFor: 28,
      votesAgainst: 5,
      totalVotes: 33,
      voters: [],
      category: 'governance'
    },
    {
      id: '4',
      title: 'New Staking Mechanism Implementation',
      description: 'Introduce liquid staking to allow token holders to stake while maintaining liquidity for governance participation.',
      proposer: '0x1111222233334444',
      status: 'active',
      createdAt: new Date('2024-01-14'),
      endDate: new Date('2024-01-21'),
      quorumRequired: 35,
      votesFor: 31,
      votesAgainst: 8,
      totalVotes: 39,
      voters: [],
      category: 'protocol'
    },
    {
      id: '5',
      title: 'Cross-Chain Bridge Security Audit',
      description: 'Fund comprehensive security audit for the upcoming cross-chain bridge implementation to ensure user funds safety.',
      proposer: '0x5555666677778888',
      status: 'active',
      createdAt: new Date('2024-01-13'),
      endDate: new Date('2024-01-23'),
      quorumRequired: 25,
      votesFor: 19,
      votesAgainst: 4,
      totalVotes: 23,
      voters: [],
      category: 'technical'
    },
    {
      id: '6',
      title: 'Community Events and Marketing Budget',
      description: 'Allocate 50,000 GOV tokens for community events, hackathons, and marketing initiatives to grow the ecosystem.',
      proposer: '0x9999aaaabbbbcccc',
      status: 'pending',
      createdAt: new Date('2024-01-16'),
      endDate: new Date('2024-01-26'),
      quorumRequired: 40,
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      voters: [],
      category: 'community'
    },
    {
      id: '7',
      title: 'Fee Structure Optimization',
      description: 'Reduce transaction fees by 30% to improve user experience and increase network adoption.',
      proposer: '0xddddeeeeffffaaaa',
      status: 'active',
      createdAt: new Date('2024-01-12'),
      endDate: new Date('2024-01-19'),
      quorumRequired: 30,
      votesFor: 24,
      votesAgainst: 11,
      totalVotes: 35,
      voters: [],
      category: 'protocol'
    },
    {
      id: '8',
      title: 'Grant Program for DeFi Innovation',
      description: 'Establish a 200,000 GOV token grant program to support innovative DeFi projects building on our platform.',
      proposer: '0xbbbbccccddddeeee',
      status: 'active',
      createdAt: new Date('2024-01-11'),
      endDate: new Date('2024-01-18'),
      quorumRequired: 45,
      votesFor: 38,
      votesAgainst: 7,
      totalVotes: 45,
      voters: [],
      category: 'treasury'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || proposal.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleRoleChange = (role: 'admin' | 'proposer' | 'voter') => {
    setCurrentUser(prev => ({ ...prev, role }));
    toast({
      title: "Role Updated",
      description: `You are now acting as a ${role}`,
    });
  };

  const handleCreateProposal = (proposalData: Omit<Proposal, 'id' | 'votesFor' | 'votesAgainst' | 'totalVotes' | 'voters'>) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: Date.now().toString(),
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      voters: []
    };
    
    setProposals(prev => [newProposal, ...prev]);
    toast({
      title: "Proposal Created",
      description: "Your proposal has been submitted successfully!",
    });
  };

  const handleVote = (proposalId: string, choice: 'for' | 'against') => {
    setProposals(prev => prev.map(proposal => {
      if (proposal.id === proposalId && !proposal.voters.includes(currentUser.address)) {
        const updatedProposal = {
          ...proposal,
          voters: [...proposal.voters, currentUser.address],
          totalVotes: proposal.totalVotes + currentUser.votingPower
        };
        
        if (choice === 'for') {
          updatedProposal.votesFor += currentUser.votingPower;
        } else {
          updatedProposal.votesAgainst += currentUser.votingPower;
        }
        
        return updatedProposal;
      }
      return proposal;
    }));
    
    toast({
      title: "Vote Recorded",
      description: `Your vote ${choice === 'for' ? 'in favor' : 'against'} has been recorded!`,
    });
  };

  const handleViewDetails = (proposal: Proposal) => {
    toast({
      title: "Proposal Details",
      description: `Viewing details for: ${proposal.title}`,
    });
  };

  const activeProposals = proposals.filter(p => p.status === 'active').length;
  const totalVoters = new Set(proposals.flatMap(p => p.voters)).size;
  const participationRate = proposals.length > 0 ? (totalVoters / proposals.length) * 10 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <GovernanceHeader
          currentUser={currentUser}
          onCreateProposal={() => setIsCreateModalOpen(true)}
          onRoleChange={handleRoleChange}
        />
        
        <GovernanceStats
          totalProposals={proposals.length}
          activeProposals={activeProposals}
          totalVoters={totalVoters}
          participationRate={participationRate}
        />
        
        <div className="governance-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-gray-300">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="treasury">Treasury</SelectItem>
                <SelectItem value="protocol">Protocol</SelectItem>
                <SelectItem value="governance">Governance</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                currentUser={currentUser}
                onVote={handleVote}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          {filteredProposals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-600 text-lg mb-2">No proposals found</div>
              <div className="text-gray-500">Try adjusting your search or filters</div>
            </div>
          )}
        </div>
        
        <CreateProposalModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProposal}
          proposerAddress={currentUser.address}
        />
      </div>
    </div>
  );
};

export default Index;
