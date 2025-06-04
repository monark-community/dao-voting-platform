
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Vote, Plus } from 'lucide-react';
import { User } from '@/types/governance';

interface GovernanceHeaderProps {
  currentUser: User;
  onCreateProposal: () => void;
  onRoleChange: (role: 'admin' | 'proposer' | 'voter') => void;
}

const GovernanceHeader = ({ currentUser, onCreateProposal, onRoleChange }: GovernanceHeaderProps) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'proposer': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'voter': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="governance-card p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-governance-gradient rounded-full flex items-center justify-center">
            <Vote className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              GovChain
            </h1>
            <p className="text-gray-400">Decentralized Governance Platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="capitalize">{currentUser.role}</span>
            </Button>
            
            {isRoleMenuOpen && (
              <div className="absolute top-full mt-2 right-0 w-48 governance-card p-2 z-50">
                {['admin', 'proposer', 'voter'].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role as any);
                      setIsRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-700 transition-colors capitalize"
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 governance-card">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{currentUser.address.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{currentUser.address.slice(0, 8)}...</div>
              <div className="text-gray-400">{currentUser.tokenBalance} GOV</div>
            </div>
            <Badge className={`${getRoleBadgeColor(currentUser.role)} border`}>
              {currentUser.role}
            </Badge>
          </div>
          
          {(currentUser.role === 'admin' || currentUser.role === 'proposer') && (
            <Button 
              onClick={onCreateProposal}
              className="bg-governance-gradient hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Proposal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernanceHeader;
