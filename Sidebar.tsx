import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  LayoutDashboard,
  FileText,
  Layers,
  HelpCircle,
  BarChart3,
  BookOpen,
  Calendar,
  Settings,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

type AppView = 'dashboard' | 'materials' | 'flashcards' | 'quizzes' | 'progress' | 'resources' | 'plan';

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'materials', label: 'Study Materials', icon: FileText },
  { id: 'flashcards', label: 'Flashcards', icon: Layers, badge: 12 },
  { id: 'quizzes', label: 'Practice Tests', icon: HelpCircle },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'plan', label: 'Study Plan', icon: Calendar },
];

export function Sidebar() {
  const { isSidebarOpen, currentView, setCurrentView, stats } = useStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-20 bottom-0 z-40 bg-white border-r border-border transition-all duration-500',
        isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
      )}
      style={{
        transitionTimingFunction: 'var(--ease-expo-out)',
      }}
    >
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Progress Card */}
          {isSidebarOpen && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Daily Goal</span>
              </div>
              <Progress value={65} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>65% complete</span>
                <span>45 min left</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 transition-all duration-300',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'hover:bg-primary/10',
                    !isSidebarOpen && 'lg:justify-center lg:px-2'
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  onClick={() => setCurrentView(item.id)}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'animate-pulse')} />
                  {isSidebarOpen && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                  {isSidebarOpen && item.badge && (
                    <span className="px-2 py-0.5 text-xs bg-primary-foreground/20 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Stats Summary */}
          {isSidebarOpen && (
            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Your Stats
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-muted space-y-1">
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="text-lg font-bold text-primary">{stats.confidenceScore}%</p>
                </div>
                <div className="p-3 rounded-xl bg-muted space-y-1">
                  <p className="text-xs text-muted-foreground">Readiness</p>
                  <p className="text-lg font-bold text-success">{stats.readinessScore}%</p>
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-muted space-y-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Overall Progress</p>
                  <p className="text-sm font-bold">{stats.overallProgress}%</p>
                </div>
                <Progress value={stats.overallProgress} className="h-1.5" />
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="pt-4 border-t border-border">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 text-muted-foreground hover:text-foreground',
                !isSidebarOpen && 'lg:justify-center lg:px-2'
              )}
            >
              <Settings className="h-5 w-5" />
              {isSidebarOpen && <span>Settings</span>}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
