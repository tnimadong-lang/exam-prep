import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/views/Dashboard';
import { Materials } from '@/views/Materials';
import { Flashcards } from '@/views/Flashcards';
import { Quizzes } from '@/views/Quizzes';
import { Progress } from '@/views/Progress';
import { Resources } from '@/views/Resources';
import { StudyPlanView } from '@/views/StudyPlan';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const { currentView, isSidebarOpen, progress, updateStats } = useStore();

  // Calculate stats based on progress
  useEffect(() => {
    const calculateStats = () => {
      // Confidence score based on quiz performance and flashcard mastery
      const confidenceScore = Math.min(
        100,
        Math.round(
          (progress.averageScore * 0.4) +
          (progress.flashcardsReviewed > 0 ? 30 : 0) +
          (progress.streakDays * 2)
        )
      );

      // Readiness score based on concepts mastered
      const conceptCount = Object.keys(progress.conceptMastery).length;
      const masteredConcepts = Object.values(progress.conceptMastery).filter(
        (m) => m >= 80
      ).length;
      const readinessScore = conceptCount > 0
        ? Math.round((masteredConcepts / conceptCount) * 100)
        : 30;

      // Consistency score based on streak and sessions
      const consistencyScore = Math.min(
        100,
        Math.round(
          (progress.streakDays * 10) +
          (progress.sessionsCompleted * 2)
        )
      );

      // Overall progress
      const overallProgress = Math.round(
        (confidenceScore + readinessScore + consistencyScore) / 3
      );

      updateStats({
        confidenceScore,
        readinessScore,
        consistencyScore,
        overallProgress,
      });
    };

    calculateStats();
  }, [progress, updateStats]);

  // Welcome toast on first load
  useEffect(() => {
    const hasVisited = localStorage.getItem('exam-prep-visited');
    if (!hasVisited) {
      toast.success('Welcome to ExamPrep Pro!', {
        description: 'Start by uploading your study materials or exploring the dashboard.',
        duration: 5000,
      });
      localStorage.setItem('exam-prep-visited', 'true');
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'materials':
        return <Materials />;
      case 'flashcards':
        return <Flashcards />;
      case 'quizzes':
        return <Quizzes />;
      case 'progress':
        return <Progress />;
      case 'resources':
        return <Resources />;
      case 'plan':
        return <StudyPlanView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main
        className={`
          pt-20 transition-all duration-500 min-h-screen
          ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}
        `}
        style={{
          transitionTimingFunction: 'var(--ease-expo-out)',
        }}
      >
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}

export default App;
