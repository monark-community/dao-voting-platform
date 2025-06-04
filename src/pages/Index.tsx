
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
    <div className="min-h-screen p-4 md:p-8">
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
                className="pl-10 bg-slate-800 border-slate-600"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-600">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-600">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
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
              <div className="text-gray-400 text-lg mb-2">No proposals found</div>
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
