
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Building, Plus, User, ChevronDown } from 'lucide-react';
import { User as UserType } from '@/types/governance';

interface GovernanceHeaderProps {
  currentUser: UserType;
  onCreateProposal: () => void;
  onRoleChange: (role: 'admin' | 'proposer' | 'voter') => void;
}

const GovernanceHeader = ({ currentUser, onCreateProposal, onRoleChange }: GovernanceHeaderProps) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-50 text-red-700 border-red-200';
      case 'proposer': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'voter': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="governance-card p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              GovChain
            </h1>
            <p className="text-gray-600">Decentralized Governance Platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-3 px-4 py-2 governance-card hover:shadow-md transition-all duration-200"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gray-100 text-gray-700">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-left">
                <div className="font-medium text-gray-900">
                  User123 <span className="text-gray-400 font-normal">{currentUser.address.slice(0, 8)}...</span>
                </div>
                <div className="text-gray-500">{currentUser.tokenBalance} GOV</div>
              </div>
              <Badge className={`${getRoleBadgeColor(currentUser.role)} border`}>
                {currentUser.role}
              </Badge>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            {isRoleMenuOpen && (
              <div className="absolute top-full mt-2 right-0 w-48 governance-card p-2 z-50">
                {['admin', 'proposer', 'voter'].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role as any);
                      setIsRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition-colors capitalize"
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {(currentUser.role === 'admin' || currentUser.role === 'proposer') && (
            <Button 
              onClick={onCreateProposal}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
