import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingUp,
  Target,
  Flame,
  Clock,
  Brain,
  Zap,
  Calendar,
  CheckCircle,
  AlertCircle,
  Trophy,
  Lock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Mock data for charts
const weeklyProgress = [
  { day: 'Mon', studyTime: 2.5, score: 75, cards: 15 },
  { day: 'Tue', studyTime: 3.8, score: 78, cards: 22 },
  { day: 'Wed', studyTime: 1.5, score: 76, cards: 10 },
  { day: 'Thu', studyTime: 4.2, score: 82, cards: 28 },
  { day: 'Fri', studyTime: 3.0, score: 85, cards: 20 },
  { day: 'Sat', studyTime: 5.5, score: 88, cards: 35 },
  { day: 'Sun', studyTime: 4.0, score: 90, cards: 25 },
];

const conceptMastery = [
  { name: 'Mathematics', mastery: 85, total: 100 },
  { name: 'Physics', mastery: 72, total: 100 },
  { name: 'Chemistry', mastery: 90, total: 100 },
  { name: 'Biology', mastery: 65, total: 100 },
  { name: 'History', mastery: 88, total: 100 },
  { name: 'English', mastery: 92, total: 100 },
];

const activityDistribution = [
  { name: 'Flashcards', value: 45, color: '#2467ec' },
  { name: 'Quizzes', value: 30, color: '#8b5cf6' },
  { name: 'Reading', value: 15, color: '#06b6d4' },
  { name: 'Review', value: 10, color: '#4ade80' },
];

export function Progress() {
  const { progress, stats, achievements, sessions, concepts } = useStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);

  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return { label: 'High', color: 'text-success', bg: 'bg-success/20' };
    if (score >= 60) return { label: 'Medium', color: 'text-warning', bg: 'bg-warning/20' };
    return { label: 'Low', color: 'text-destructive', bg: 'bg-destructive/20' };
  };

  const confidence = getConfidenceLevel(stats.confidenceScore);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground mt-1">
            Track your learning journey and achievements
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedTimeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedTimeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedTimeRange === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className={`text-3xl font-bold mt-1 ${confidence.color}`}>
                  {stats.confidenceScore}%
                </p>
                <Badge className={`mt-2 ${confidence.bg} ${confidence.color} border-0`}>
                  {confidence.label}
                </Badge>
              </div>
              <div className={`w-12 h-12 rounded-xl ${confidence.bg} flex items-center justify-center`}>
                <Brain className={`h-6 w-6 ${confidence.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Readiness</p>
                <p className="text-3xl font-bold mt-1 text-accent">
                  {stats.readinessScore}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Exam readiness
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consistency</p>
                <p className="text-3xl font-bold mt-1 text-primary">
                  {stats.consistencyScore}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {progress.streakDays} day streak
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall</p>
                <p className="text-3xl font-bold mt-1 text-success">
                  {stats.overallProgress}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Total progress
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Study Time Chart */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Study Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="studyTime" fill="#2467ec" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Score Trend */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Score Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#4ade80"
                        strokeWidth={2}
                        dot={{ fill: '#4ade80' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Distribution */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-warning" />
                Activity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {activityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  {activityDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="flex-1">{item.name}</span>
                      <span className="font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Concepts Tab */}
        <TabsContent value="concepts" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                Concept Mastery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={conceptMastery}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Mastery"
                      dataKey="mastery"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concepts.map((concept) => (
              <Card key={concept.id} className="card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{concept.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {concept.description}
                      </p>
                    </div>
                    <Badge
                      variant={concept.masteryLevel >= 80 ? 'default' : 'secondary'}
                    >
                      {concept.masteryLevel}%
                    </Badge>
                  </div>
                  <ProgressBar value={concept.masteryLevel} className="h-2" />
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {concept.flashcards.length} flashcards
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {concept.difficulty}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unlocked Achievements */}
            {unlockedAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="card-hover border-success/30 bg-success/5"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-success/20 flex items-center justify-center">
                      <Trophy className="h-7 w-7 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <Badge className="bg-success text-white">Unlocked</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Unlocked {achievement.unlockedAt?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Locked Achievements */}
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="card-hover opacity-70">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                      <Lock className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="mt-2">
                        <ProgressBar
                          value={(achievement.current / achievement.requirement) * 100}
                          className="h-1.5"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.current} / {achievement.requirement}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {sessions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No activity yet</p>
                      <p className="text-sm text-muted-foreground">
                        Start studying to see your activity here
                      </p>
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                      >
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          ${session.activityType === 'flashcard' ? 'bg-blue-100 text-blue-600' : ''}
                          ${session.activityType === 'quiz' ? 'bg-purple-100 text-purple-600' : ''}
                          ${session.activityType === 'concept_review' ? 'bg-green-100 text-green-600' : ''}
                          ${session.activityType === 'material_upload' ? 'bg-orange-100 text-orange-600' : ''}
                        `}>
                          {session.activityType === 'flashcard' && <Brain className="h-5 w-5" />}
                          {session.activityType === 'quiz' && <Target className="h-5 w-5" />}
                          {session.activityType === 'concept_review' && <CheckCircle className="h-5 w-5" />}
                          {session.activityType === 'material_upload' && <Calendar className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium capitalize">
                            {session.activityType.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.date).toLocaleDateString()} • {session.duration} min
                          </p>
                        </div>
                        {session.performance !== undefined && (
                          <Badge
                            variant={session.performance >= 80 ? 'default' : 'secondary'}
                          >
                            {session.performance}%
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
