import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Calendar as CalendarIcon,
  Clock,
  Target,
  Circle,
  Plus,
  Sparkles,
  Brain,
  Layers,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import type { StudyPlan, Task } from '@/types';

// Mock study plan
const mockStudyPlan: StudyPlan = {
  id: 'plan-1',
  title: 'Final Exam Preparation',
  description: 'Comprehensive study plan for upcoming final exams',
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  examDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  estimatedHours: 120,
  topics: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
  dailyGoals: [
    {
      date: new Date(),
      completed: false,
      tasks: [
        {
          id: 'task-1',
          title: 'Review Calculus Chapter 5',
          type: 'concept_study',
          conceptIds: [],
          estimatedTime: 45,
          completed: false,
        },
        {
          id: 'task-2',
          title: 'Practice 20 Flashcards',
          type: 'flashcard_review',
          conceptIds: [],
          estimatedTime: 30,
          completed: true,
        },
        {
          id: 'task-3',
          title: 'Take Physics Quiz',
          type: 'quiz_practice',
          conceptIds: [],
          estimatedTime: 45,
          completed: false,
        },
      ],
    },
    {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      completed: false,
      tasks: [
        {
          id: 'task-4',
          title: 'Read Chemistry Chapter 3',
          type: 'material_reading',
          conceptIds: [],
          estimatedTime: 60,
          completed: false,
        },
        {
          id: 'task-5',
          title: 'Review Biology Notes',
          type: 'concept_study',
          conceptIds: [],
          estimatedTime: 30,
          completed: false,
        },
      ],
    },
  ],
};

export function StudyPlanView() {
  const { studyPlans, addStudyPlan } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    examDate: '',
    estimatedHours: '',
  });

  const allPlans = studyPlans.length > 0 ? studyPlans : [mockStudyPlan];
  const currentPlan = allPlans[0];

  const selectedDayGoal = currentPlan?.dailyGoals.find(
    (goal) => new Date(goal.date).toDateString() === selectedDate.toDateString()
  );

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'flashcard_review':
        return <Layers className="h-4 w-4" />;
      case 'quiz_practice':
        return <Target className="h-4 w-4" />;
      case 'concept_study':
        return <Brain className="h-4 w-4" />;
      case 'material_reading':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'flashcard_review':
        return 'bg-blue-100 text-blue-600';
      case 'quiz_practice':
        return 'bg-purple-100 text-purple-600';
      case 'concept_study':
        return 'bg-green-100 text-green-600';
      case 'material_reading':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateDayProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const totalTasks = currentPlan?.dailyGoals.reduce(
    (sum, day) => sum + day.tasks.length,
    0
  ) || 0;

  const completedTasks = currentPlan?.dailyGoals.reduce(
    (sum, day) => sum + day.tasks.filter((t) => t.completed).length,
    0
  ) || 0;

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCreatePlan = () => {
    if (!newPlan.title || !newPlan.examDate) return;

    const plan: StudyPlan = {
      id: `plan-${Date.now()}`,
      title: newPlan.title,
      description: newPlan.description,
      startDate: new Date(),
      endDate: new Date(newPlan.examDate),
      examDate: new Date(newPlan.examDate),
      estimatedHours: parseInt(newPlan.estimatedHours) || 100,
      topics: [],
      dailyGoals: [],
    };

    addStudyPlan(plan);
    setShowCreateDialog(false);
    setNewPlan({ title: '', description: '', examDate: '', estimatedHours: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Study Plan</h1>
          <p className="text-muted-foreground mt-1">
            Organize your exam preparation journey
          </p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-primary to-accent"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {/* Plan Overview */}
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{currentPlan?.title}</h2>
              <p className="text-muted-foreground">{currentPlan?.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentPlan?.topics.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">
                  {currentPlan?.estimatedHours}h
                </p>
                <p className="text-sm text-muted-foreground">Estimated</p>
              </div>
              {currentPlan?.examDate && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-success">
                    {Math.ceil(
                      (new Date(currentPlan.examDate).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Days Left</p>
                </div>
              )}
            </div>
          </div>
          <Progress value={overallProgress} className="h-2 mt-4" />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasTasks: currentPlan?.dailyGoals.map((g) => new Date(g.date)) || [],
              }}
              modifiersStyles={{
                hasTasks: {
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(36, 103, 236, 0.1)',
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Tasks for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayGoal ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {selectedDayGoal.tasks.filter((t) => t.completed).length} of{' '}
                      {selectedDayGoal.tasks.length} completed
                    </span>
                  </div>
                  <Progress
                    value={calculateDayProgress(selectedDayGoal.tasks)}
                    className="w-24 h-1.5"
                  />
                </div>

                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {selectedDayGoal.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`
                          flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                          ${task.completed
                            ? 'border-success/30 bg-success/5'
                            : 'border-border hover:border-primary/30'}
                        `}
                      >
                        <Checkbox
                          checked={task.completed}
                          className={task.completed ? 'border-success' : ''}
                        />
                        <div className={`w-10 h-10 rounded-lg ${getTaskTypeColor(task.type)} flex items-center justify-center`}>
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {task.estimatedTime} min
                          </p>
                        </div>
                        <Badge variant={task.completed ? 'default' : 'secondary'}>
                          {task.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No tasks for this day</h3>
                <p className="text-muted-foreground mt-1">
                  Select a different date or add new tasks
                </p>
                <Button className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const dayGoal = currentPlan?.dailyGoals[index];
              const progress = dayGoal ? calculateDayProgress(dayGoal.tasks) : 0;
              
              return (
                <div
                  key={day}
                  className={`
                    p-4 rounded-xl text-center transition-all cursor-pointer
                    ${progress === 100 ? 'bg-success/10' : 'bg-muted/50 hover:bg-muted'}
                  `}
                >
                  <p className="text-sm font-medium mb-2">{day}</p>
                  <div className="relative w-12 h-12 mx-auto">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-muted"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={`${progress * 1.26} 126`}
                        className={progress === 100 ? 'text-success' : 'text-primary'}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {progress}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {dayGoal?.tasks.length || 0} tasks
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create Plan Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Study Plan</DialogTitle>
            <DialogDescription>
              Set up a new study plan for your exam preparation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Plan Title</Label>
              <Input
                placeholder="e.g., Final Exam Prep"
                value={newPlan.title}
                onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                placeholder="Brief description of your plan"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Exam Date</Label>
              <Input
                type="date"
                value={newPlan.examDate}
                onChange={(e) => setNewPlan({ ...newPlan, examDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Estimated Study Hours</Label>
              <Input
                type="number"
                placeholder="100"
                value={newPlan.estimatedHours}
                onChange={(e) => setNewPlan({ ...newPlan, estimatedHours: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              className="gap-2 bg-gradient-to-r from-primary to-accent"
              onClick={handleCreatePlan}
              disabled={!newPlan.title || !newPlan.examDate}
            >
              <Sparkles className="h-4 w-4" />
              Create Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
