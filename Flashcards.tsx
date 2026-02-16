import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FlipCard } from '@/components/FlipCard';
import {
  Layers,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Zap,
  Calendar,
} from 'lucide-react';

interface StudySession {
  correct: number;
  incorrect: number;
  totalTime: number;
}

export function Flashcards() {
  const { flashcards, updateFlashcard, progress, updateProgress, addSession } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [session, setSession] = useState<StudySession>({
    correct: 0,
    incorrect: 0,
    totalTime: 0,
  });
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Get due flashcards
  const dueFlashcards = flashcards.filter((f) => {
    if (!f.nextReview) return true;
    return new Date(f.nextReview) <= new Date();
  });

  const currentCard = dueFlashcards[currentIndex];

  useEffect(() => {
    if (dueFlashcards.length > 0 && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
  }, [dueFlashcards.length, sessionStartTime]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleResponse = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;

    const isCorrect = difficulty === 'easy';
    const newReviewCount = currentCard.reviewCount + 1;
    
    // Calculate next review date based on spaced repetition
    let nextReviewDays = 1;
    if (isCorrect) {
      if (newReviewCount === 1) nextReviewDays = 1;
      else if (newReviewCount === 2) nextReviewDays = 3;
      else if (newReviewCount === 3) nextReviewDays = 7;
      else if (newReviewCount === 4) nextReviewDays = 14;
      else nextReviewDays = 30;
    } else {
      nextReviewDays = 1; // Reset if incorrect
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + nextReviewDays);

    updateFlashcard(currentCard.id, {
      lastReviewed: new Date(),
      nextReview,
      reviewCount: newReviewCount,
      correctStreak: isCorrect ? currentCard.correctStreak + 1 : 0,
    });

    setSession((prev) => ({
      ...prev,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));

    // Move to next card
    if (currentIndex < dueFlashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    const endTime = new Date();
    const duration = sessionStartTime
      ? Math.floor((endTime.getTime() - sessionStartTime.getTime()) / 60000)
      : 0;

    setSession((prev) => ({ ...prev, totalTime: duration }));
    setShowSummary(true);

    // Update progress
    updateProgress({
      flashcardsReviewed: progress.flashcardsReviewed + session.correct + session.incorrect + 1,
    });

    // Add study session
    addSession({
      id: `session-${Date.now()}`,
      date: new Date(),
      duration,
      activityType: 'flashcard',
      conceptIds: dueFlashcards.map((f) => f.conceptId),
      performance: Math.round((session.correct / (session.correct + session.incorrect + 1)) * 100),
    });
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSession({ correct: 0, incorrect: 0, totalTime: 0 });
    setSessionStartTime(null);
    setShowSummary(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success/20 text-success';
      case 'medium':
        return 'bg-warning/20 text-warning';
      case 'hard':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressPercentage = () => {
    if (dueFlashcards.length === 0) return 100;
    return ((currentIndex + 1) / dueFlashcards.length) * 100;
  };

  if (flashcards.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-1">
            Review and memorize key concepts
          </p>
        </div>
        
        <Card className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Layers className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No flashcards yet</h3>
          <p className="text-muted-foreground mt-1 max-w-md mx-auto">
            Upload study materials to automatically generate flashcards, or create them manually from your concepts.
          </p>
        </Card>
      </div>
    );
  }

  if (dueFlashcards.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-1">
            Review and memorize key concepts
          </p>
        </div>
        
        <Card className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h3 className="text-lg font-medium">All caught up!</h3>
          <p className="text-muted-foreground mt-1 max-w-md mx-auto">
            You've reviewed all your flashcards for today. Come back tomorrow for more!
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{flashcards.length}</p>
              <p className="text-sm text-muted-foreground">Total Cards</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {Math.round((progress.flashcardsReviewed / flashcards.length) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Mastery</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (showSummary) {
    const accuracy = Math.round(
      (session.correct / (session.correct + session.incorrect)) * 100
    );

    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Session Complete!</h1>
          <p className="text-muted-foreground mt-1">
            Great job! Here's how you performed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <p className="text-3xl font-bold">{session.correct}</p>
            <p className="text-sm text-muted-foreground">Correct</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center mx-auto mb-3">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-3xl font-bold">{session.incorrect}</p>
            <p className="text-sm text-muted-foreground">Incorrect</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">{accuracy}%</p>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>Session Duration</span>
            </div>
            <span className="font-semibold">{session.totalTime} minutes</span>
          </div>
          <Progress value={accuracy} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {accuracy >= 80
              ? 'Excellent! You\'re mastering these concepts!'
              : accuracy >= 60
              ? 'Good progress! Keep practicing to improve.'
              : 'Keep going! Review the difficult cards again.'}
          </p>
        </Card>

        <div className="flex justify-center">
          <Button onClick={resetSession} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Study Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-1">
            Review and memorize key concepts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="font-semibold">
              {currentIndex + 1} / {dueFlashcards.length}
            </p>
          </div>
          <div className="w-32">
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4">
        <Badge variant="secondary" className="gap-2">
          <CheckCircle className="h-3 w-3 text-success" />
          {session.correct} Correct
        </Badge>
        <Badge variant="secondary" className="gap-2">
          <XCircle className="h-3 w-3 text-destructive" />
          {session.incorrect} Incorrect
        </Badge>
        <Badge variant="secondary" className="gap-2">
          <Clock className="h-3 w-3" />
          {sessionStartTime
            ? Math.floor((Date.now() - sessionStartTime.getTime()) / 60000)
            : 0}{' '}
          min
        </Badge>
      </div>

      {/* Flashcard */}
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <Badge className={getDifficultyColor(currentCard?.difficulty || 'medium')}>
            {currentCard?.difficulty.charAt(0).toUpperCase() +
              currentCard?.difficulty.slice(1)}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Reviewed {currentCard?.reviewCount || 0} times
          </div>
        </div>

        <FlipCard
          isFlipped={isFlipped}
          onClick={handleFlip}
          frontContent={
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Brain className="h-12 w-12 text-primary/50 mb-4" />
              <h3 className="text-2xl font-semibold">{currentCard?.front}</h3>
              <p className="text-muted-foreground mt-4">Click to reveal answer</p>
            </div>
          }
          backContent={
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Zap className="h-8 w-8 text-warning mb-4" />
              <p className="text-xl">{currentCard?.back}</p>
              <div className="mt-6 p-4 rounded-lg bg-muted/50 text-left w-full">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Study Tip:
                </p>
                <p className="text-sm">
                  Try to connect this concept with something you already know to strengthen memory retention.
                </p>
              </div>
            </div>
          }
        />

        {/* Response Buttons */}
        {isFlipped && (
          <div className="mt-6 grid grid-cols-3 gap-3 animate-slide-in-up">
            <Button
              variant="outline"
              className="gap-2 border-destructive/30 hover:bg-destructive/10"
              onClick={() => handleResponse('hard')}
            >
              <ThumbsDown className="h-4 w-4" />
              Hard
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-warning/30 hover:bg-warning/10"
              onClick={() => handleResponse('medium')}
            >
              <Clock className="h-4 w-4" />
              Good
            </Button>
            <Button
              className="gap-2 bg-success hover:bg-success/90"
              onClick={() => handleResponse('easy')}
            >
              <ThumbsUp className="h-4 w-4" />
              Easy
            </Button>
          </div>
        )}

        {!isFlipped && (
          <p className="text-center text-muted-foreground mt-4">
            Click the card to flip and see the answer
          </p>
        )}
      </div>
    </div>
  );
}
