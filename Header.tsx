import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Menu,
  X,
  Bell,
  Flame,
  Trophy,
  User,
} from 'lucide-react';

export function Header() {
  const { toggleSidebar, isSidebarOpen, progress, achievements } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt).length;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'h-16 bg-white/90 backdrop-blur-xl shadow-sm'
          : 'h-20 bg-transparent'
      }`}
      style={{
        transitionTimingFunction: 'var(--ease-expo-out)',
      }}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:flex hidden hover:bg-primary/10 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 text-primary" />
            ) : (
              <Menu className="h-5 w-5 text-primary" />
            )}
          </Button>
          
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform duration-300 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}
            >
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-lg leading-tight">ExamPrep Pro</h1>
              <p className="text-xs text-muted-foreground">Adaptive Learning</p>
            </div>
          </div>
        </div>

        {/* Center Section - Stats */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="font-semibold text-sm">{progress.streakDays} days</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Achievements</p>
              <p className="font-semibold text-sm">{unlockedAchievements}</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-primary/10 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
              >
                {notifications}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 transition-colors"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
