
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Proposal } from '@/types/governance';

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposal: Omit<Proposal, 'id' | 'votesFor' | 'votesAgainst' | 'totalVotes' | 'voters'>) => void;
  proposerAddress: string;
}

const CreateProposalModal = ({ isOpen, onClose, onSubmit, proposerAddress }: CreateProposalModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quorumRequired: 10,
    durationDays: 7
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const proposal = {
      title: formData.title,
      description: formData.description,
      proposer: proposerAddress,
      status: 'active' as const,
      createdAt: new Date(),
      endDate: new Date(Date.now() + formData.durationDays * 24 * 60 * 60 * 1000),
      quorumRequired: formData.quorumRequired,
      category: formData.category
    };
    
    onSubmit(proposal);
    setFormData({
      title: '',
      description: '',
      category: '',
      quorumRequired: 10,
      durationDays: 7
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="governance-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Create New Proposal
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              placeholder="Enter proposal title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="bg-slate-800 border-slate-600"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your proposal in detail..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
              className="bg-slate-800 border-slate-600"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="treasury">Treasury</SelectItem>
                  <SelectItem value="protocol">Protocol</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="30"
                value={formData.durationDays}
                onChange={(e) => setFormData(prev => ({ ...prev, durationDays: parseInt(e.target.value) }))}
                className="bg-slate-800 border-slate-600"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quorum">Quorum Required</Label>
            <Input
              id="quorum"
              type="number"
              min="1"
              value={formData.quorumRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, quorumRequired: parseInt(e.target.value) }))}
              className="bg-slate-800 border-slate-600"
            />
            <p className="text-sm text-gray-400">Minimum number of votes required for proposal to pass</p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-governance-gradient">
              Create Proposal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProposalModal;
