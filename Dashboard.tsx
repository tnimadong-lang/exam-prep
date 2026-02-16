import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Flame,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Layers,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Award,
  Calendar,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Mock data for charts
const studyData = [
  { day: 'Mon', hours: 2.5, score: 75 },
  { day: 'Tue', hours: 3.8, score: 78 },
  { day: 'Wed', hours: 1.5, score: 76 },
  { day: 'Thu', hours: 4.2, score: 82 },
  { day: 'Fri', hours: 3.0, score: 85 },
  { day: 'Sat', hours: 5.5, score: 88 },
  { day: 'Sun', hours: 4.0, score: 90 },
];

const skillData = [
  { subject: 'Math', score: 85, fullMark: 100 },
  { subject: 'Science', score: 72, fullMark: 100 },
  { subject: 'History', score: 90, fullMark: 100 },
  { subject: 'English', score: 88, fullMark: 100 },
  { subject: 'Coding', score: 65, fullMark: 100 },
  { subject: 'Logic', score: 78, fullMark: 100 },
];

const upcomingTasks = [
  { id: 1, title: 'Review Calculus Flashcards', type: 'flashcard', time: '30 min', priority: 'high' },
  { id: 2, title: 'Physics Practice Quiz', type: 'quiz', time: '45 min', priority: 'medium' },
  { id: 3, title: 'Read Chapter 5 - Biology', type: 'reading', time: '60 min', priority: 'medium' },
  { id: 4, title: 'Concept Review: Thermodynamics', type: 'review', time: '20 min', priority: 'low' },
];

const recentAchievements = [
  { id: 1, title: '7-Day Streak!', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 2, title: 'Flashcard Master', icon: Layers, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 3, title: 'Quiz Champion', icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-100' },
];

export function Dashboard() {
  const { progress, materials, flashcards, setCurrentView } = useStore();
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const dueFlashcards = flashcards.filter((f) => {
    if (!f.nextReview) return true;
    return new Date(f.nextReview) <= new Date();
  }).length;

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {greeting}, Student! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            You're on a {progress.streakDays}-day streak. Keep it up!
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setCurrentView('plan')}
          >
            <Calendar className="h-4 w-4" />
            View Plan
          </Button>
          <Button
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            onClick={() => setCurrentView('materials')}
          >
            <Sparkles className="h-4 w-4" />
            Start Studying
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="text-3xl font-bold mt-1">
                  {Math.floor(progress.totalStudyTime / 60)}h {progress.totalStudyTime % 60}m
                </p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% this week
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Materials</p>
                <p className="text-3xl font-bold mt-1">{materials.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {materials.length > 0 ? 'Active' : 'Upload to start'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Cards</p>
                <p className="text-3xl font-bold mt-1">{dueFlashcards}</p>
                <p className="text-xs text-warning flex items-center gap-1 mt-1">
                  <Zap className="h-3 w-3" />
                  Review now
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Layers className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-3xl font-bold mt-1">{progress.averageScore}%</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <Target className="h-3 w-3" />
                  Target: 90%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Brain className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Activity Chart */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Study Activity
            </CardTitle>
            <Badge variant="secondary">This Week</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studyData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2467ec" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2467ec" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#2467ec"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Radar */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Skill Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar
                    name="Skills"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Tasks
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px]">
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${task.type === 'flashcard' ? 'bg-blue-100 text-blue-600' : ''}
                      ${task.type === 'quiz' ? 'bg-purple-100 text-purple-600' : ''}
                      ${task.type === 'reading' ? 'bg-green-100 text-green-600' : ''}
                      ${task.type === 'review' ? 'bg-orange-100 text-orange-600' : ''}
                    `}>
                      {task.type === 'flashcard' && <Layers className="h-5 w-5" />}
                      {task.type === 'quiz' && <HelpCircle className="h-5 w-5" />}
                      {task.type === 'reading' && <BookOpen className="h-5 w-5" />}
                      {task.type === 'review' && <Brain className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                    <Badge
                      variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Recent Achievements
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setCurrentView('progress')}
            >
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-transparent hover:from-muted transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl ${achievement.bg} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${achievement.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">Unlocked today</p>
                    </div>
                    <Badge variant="outline" className="text-xs">New</Badge>
                  </div>
                );
              })}
            </div>
            
            {/* Motivation Message */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <Flame className="h-5 w-5 text-orange-500" />
                <p className="text-sm">
                  <span className="font-semibold">Keep going!</span> You're 15% closer to your goal than last week.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
