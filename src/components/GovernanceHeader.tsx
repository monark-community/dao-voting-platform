
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
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
              className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 min-w-[280px]"
            >
              <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-900 text-base">
                  User123 <span className="text-gray-400 font-normal text-sm">{currentUser.address.slice(0, 8)}...</span>
                </div>
                <div className="text-gray-600 text-sm font-medium">{currentUser.tokenBalance} GOV tokens</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`${getRoleBadgeColor(currentUser.role)} border px-3 py-1 font-medium`}>
                  {currentUser.role}
                </Badge>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            
            {isRoleMenuOpen && (
              <div className="absolute top-full mt-2 right-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50">
                {['admin', 'proposer', 'voter'].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role as any);
                      setIsRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors capitalize font-medium text-gray-700 hover:text-gray-900"
                  >
                    Switch to {role}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {(currentUser.role === 'admin' || currentUser.role === 'proposer') && (
            <Button 
              onClick={onCreateProposal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium"
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
