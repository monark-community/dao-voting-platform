
export type ProposalStatus = 'draft' | 'active' | 'completed' | 'failed';

export type UserRole = 'admin' | 'proposer' | 'voter';

export interface User {
  id: string;
  address: string;
  role: UserRole;
  tokenBalance: number;
  votingPower: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: ProposalStatus;
  createdAt: Date;
  endDate: Date;
  quorumRequired: number;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  voters: string[];
  category: string;
}

export interface Vote {
  proposalId: string;
  voter: string;
  choice: 'for' | 'against';
  votingPower: number;
  timestamp: Date;
}
