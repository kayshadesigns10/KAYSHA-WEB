import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  fullAddress: string;
  pincode: string;
  mobile: string;
  alternativeNumber?: string;
  email?: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('kaysha-user-profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('kaysha-user-profile', JSON.stringify(profile));
    }
  }, [profile]);

  const saveProfile = (profileData: UserProfile) => {
    setProfile(profileData);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('kaysha-user-profile');
  };

  const isProfileComplete = () => {
    return profile && 
           profile.name.trim() !== '' && 
           profile.fullAddress.trim() !== '' && 
           profile.pincode.trim() !== '' && 
           profile.mobile.trim() !== '';
  };

  return {
    profile,
    saveProfile,
    updateProfile,
    clearProfile,
    isProfileComplete,
    hasProfile: !!profile,
  };
}