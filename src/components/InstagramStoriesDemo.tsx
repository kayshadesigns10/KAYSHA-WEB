import React from 'react';
import { InstagramStories } from '@/components/ui/instagram-stories';

const InstagramStoriesDemo: React.FC = () => {
  const accounts = [
    {
      username: 'kaysha_designs',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b332c74c?q=80&w=150&h=150&auto=format&fit=crop&crop=face'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="subheading mb-2">Latest</h2>
        <h3 className="heading-lg">Kaysha Stories</h3>
      </div>
      
      <div className="flex justify-center">
        {accounts.map((account) => (
          <div key={account.username} className="flex-shrink-0">
            <InstagramStories
              username={account.username}
              profileImage={account.profileImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramStoriesDemo;