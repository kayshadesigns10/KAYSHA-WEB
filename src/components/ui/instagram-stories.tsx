import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, X, Play, Pause, Pin, ExternalLink } from 'lucide-react';

interface Story {
  id: string;
  imageUrl: string;
  timestamp: Date;
  viewed: boolean;
  isPinned?: boolean;
  caption?: string;
  reelUrl?: string;
}

interface InstagramStoriesProps {
  username: string;
  profileImage?: string;
  className?: string;
}

// Mock data - replace with actual Instagram API call for @kaysha_designs
// To integrate with real Instagram data:
// 1. Use Instagram Basic Display API or Instagram Graph API
// 2. Fetch stories using: GET /{user-id}/stories
// 3. Fetch highlights using: GET /{user-id}/story_highlights
// 4. Parse response to match Story interface structure
const generateMockStories = (username: string): Story[] => {
  const kayshaPosts = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=400&h=600&auto=format&fit=crop',
      caption: 'Latest design collection showcase',
      isPinned: true,
      reelUrl: 'https://www.instagram.com/reel/DLUjiDxJR7_/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1632149877166-f75d49000351?q=80&w=400&h=600&auto=format&fit=crop',
      caption: 'Behind the scenes styling session',
      isPinned: false,
      reelUrl: 'https://www.instagram.com/reel/DLXLvS7Njg1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=400&h=600&auto=format&fit=crop',
      caption: 'Elegant evening wear collection',
      isPinned: true,
      reelUrl: 'https://www.instagram.com/reel/DNBlIFEt9rF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&h=600&auto=format&fit=crop',
      caption: 'Professional styling tips',
      isPinned: false,
      reelUrl: 'https://www.instagram.com/reel/DMnI40EtOiO/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=400&h=600&auto=format&fit=crop',
      caption: 'Custom tailoring showcase',
      isPinned: false,
      reelUrl: 'https://www.instagram.com/reel/DMfJN1qtOSN/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&h=600&auto=format&fit=crop',
      caption: 'Modern fashion trends',
      isPinned: false,
      reelUrl: 'https://www.instagram.com/reel/DMNBlwRtnq0/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
    }
  ];

  // Sort to show pinned stories first
  const sortedPosts = kayshaPosts.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return sortedPosts.map((post, index) => ({
    id: `story-${username}-${index}`,
    imageUrl: post.imageUrl,
    caption: post.caption,
    isPinned: post.isPinned,
    reelUrl: post.reelUrl,
    timestamp: new Date(Date.now() - index * 3600000), // Hours ago
    viewed: false,
  }));
};

export const InstagramStories: React.FC<InstagramStoriesProps> = ({
  username,
  profileImage,
  className = '',
}) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadStories = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockStories = generateMockStories(username);
      setStories(mockStories);
      setLoading(false);
    };

    loadStories();
  }, [username]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 2; // 5 second duration (100/20 = 5s)
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isPlaying, currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      setIsOpen(false);
      setCurrentIndex(0);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleStoryClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    setIsPlaying(true);
    setProgress(0);
    
    // Mark as viewed
    setStories(prev => prev.map((story, i) => 
      i <= index ? { ...story, viewed: true } : story
    ));
  };

  const hasUnviewedStories = stories.some(story => !story.viewed);
  const hasPinnedStories = stories.some(story => story.isPinned);

  if (loading) {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <Avatar className="w-16 h-16 border-2 border-gray-300">
          <AvatarImage src={profileImage} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-xs text-gray-500 truncate w-16 text-center">
          {username}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className={`flex flex-col items-center space-y-2 cursor-pointer ${className}`}>
        <div className="relative">
          <div
            className={`rounded-full p-0.5 ${
              hasUnviewedStories 
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500' 
                : 'bg-gray-300'
            }`}
            onClick={() => handleStoryClick(0)}
          >
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src={profileImage} alt={username} />
              <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          {hasPinnedStories && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
              <Pin className="w-3 h-3 text-yellow-800" />
            </div>
          )}
        </div>
        <span className="text-xs text-gray-700 truncate w-16 text-center">
          {username}
        </span>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 max-w-sm h-[80vh] bg-black border-0">
          <DialogTitle className="sr-only">Instagram Story by {username}</DialogTitle>
          <DialogDescription className="sr-only">
            Viewing story {currentIndex + 1} of {stories.length} from {username}
          </DialogDescription>
          
          {/* Progress bars */}
          <div className="absolute top-2 left-2 right-2 flex space-x-1 z-10">
            {stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-100"
                  style={{
                    width: `${
                      index < currentIndex 
                        ? 100 
                        : index === currentIndex 
                        ? progress 
                        : 0
                    }%`
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8 border border-white">
                <AvatarImage src={profileImage} alt={username} />
                <AvatarFallback className="text-xs">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm font-semibold">{username}</p>
                <p className="text-white/70 text-xs">
                  {stories[currentIndex]?.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-white hover:bg-white/10"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Story content */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={stories[currentIndex]?.imageUrl}
              alt={`Story ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              onLoad={() => setIsPlaying(true)}
            />

            {/* Caption overlay */}
            {stories[currentIndex]?.caption && (
              <div className="absolute bottom-20 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-start gap-2 mb-2">
                  {stories[currentIndex]?.isPinned && (
                    <Pin className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-white text-sm flex-1">
                    {stories[currentIndex]?.caption}
                  </p>
                </div>
                {stories[currentIndex]?.reelUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => window.open(stories[currentIndex]?.reelUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View on Instagram
                  </Button>
                )}
              </div>
            )}

            {/* Navigation overlays */}
            <div
              className="absolute left-0 top-0 w-1/3 h-full cursor-pointer z-20"
              onClick={handlePrevious}
            />
            <div
              className="absolute right-0 top-0 w-1/3 h-full cursor-pointer z-20"
              onClick={handleNext}
            />

            {/* Navigation arrows */}
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 text-white hover:bg-white/10"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
            
            {currentIndex < stories.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-white hover:bg-white/10"
                onClick={handleNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstagramStories;