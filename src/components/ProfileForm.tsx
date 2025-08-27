import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useProfile, type UserProfile } from '@/hooks/useProfile';
import { User } from 'lucide-react';

interface ProfileFormProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onProfileSaved?: (profile: UserProfile) => void;
}

export function ProfileForm({ 
  trigger, 
  open, 
  onOpenChange, 
  onProfileSaved 
}: ProfileFormProps) {
  const { profile, saveProfile } = useProfile();
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    fullAddress: '',
    pincode: '',
    mobile: '',
    alternativeNumber: '',
    email: '',
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleOpen = (openState: boolean) => {
    setIsOpen(openState);
    onOpenChange?.(openState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.fullAddress.trim() || 
        !formData.pincode.trim() || !formData.mobile.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const profileToSave = {
      ...formData,
      alternativeNumber: formData.alternativeNumber || undefined,
      email: formData.email || undefined,
    };

    saveProfile(profileToSave);
    onProfileSaved?.(profileToSave);
    handleOpen(false);
    alert('Profile saved successfully!');
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Full Address *</Label>
            <Textarea
              id="address"
              value={formData.fullAddress}
              onChange={(e) => handleChange('fullAddress', e.target.value)}
              placeholder="Enter your complete address"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              placeholder="Enter pincode"
              pattern="[0-9]{6}"
              maxLength={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              placeholder="Enter mobile number"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
          </div>

          <div>
            <Label htmlFor="altMobile">Alternative Number</Label>
            <Input
              id="altMobile"
              type="tel"
              value={formData.alternativeNumber || ''}
              onChange={(e) => handleChange('alternativeNumber', e.target.value)}
              placeholder="Enter alternative number (optional)"
              pattern="[0-9]{10}"
              maxLength={10}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email (optional)"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Save Profile
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}