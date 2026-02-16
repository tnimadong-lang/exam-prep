import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import {
  HelpCircle,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  RotateCcw,
  Trophy,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { Quiz, Question, QuizAttempt } from '@/types';

// Mock quizzes
const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Mathematics Fundamentals',
    description: 'Test your understanding of basic mathematical concepts',
    questions: [],
    timeLimit: 30,
    difficulty: 'medium',
    conceptIds: [],
    createdAt: new Date(),
  },
  {
    id: 'quiz-2',
    title: 'Physics Principles',
    description: 'Core physics concepts and formulas',
    questions: [],
    timeLimit: 45,
    difficulty: 'hard',
    conceptIds: [],
    createdAt: new Date(),
  },
  {
    id: 'quiz-3',
    title: 'Chemistry Basics',
    description: 'Elementary chemistry knowledge check',
    questions: [],
    timeLimit: 25,
    difficulty: 'easy',
    conceptIds: [],
    createdAt: new Date(),
  },
];

// Mock questions
const mockQuestions: Question[] = [
  {
    id: 'q1',
    quizId: 'quiz-1',
    type: 'multiple_choice',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2'],
    correctAnswer: '2x',
    explanation: 'Using the power rule, the derivative of x^n is n*x^(n-1). So d/dx(x²) = 2x.',
    conceptId: 'concept-1',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    quizId: 'quiz-1',
    type: 'multiple_choice',
    question: 'What is the value of π (pi) to two decimal places?',
    options: ['3.12', '3.14', '3.16', '3.18'],
    correctAnswer: '3.14',
    explanation: 'π is approximately 3.14159..., so to two decimal places it is 3.14.',
    conceptId: 'concept-2',
    difficulty: 'easy',
  },
  {
    id: 'q3',
    quizId: 'quiz-1',
    type: 'true_false',
    question: 'The square root of 16 is ±4.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Both 4² and (-4)² equal 16, so √16 = ±4.',
    conceptId: 'concept-3',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    quizId: 'quiz-1',
    type: 'multiple_choice',
    question: 'Solve for x: 2x + 5 = 13',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
    explanation: '2x + 5 = 13 → 2x = 8 → x = 4',
    conceptId: 'concept-1',
    difficulty: 'easy',
  },
  {
    id: 'q5',
    quizId: 'quiz-1',
    type: 'multiple_choice',
    question: 'What is the integral of 2x dx?',
    options: ['x² + C', '2x² + C', 'x + C', '2 + C'],
    correctAnswer: 'x² + C',
    explanation: '∫2x dx = x² + C, where C is the constant of integration.',
    conceptId: 'concept-2',
    difficulty: 'medium',
  },
];

export function Quizzes() {
  const { quizzes, addQuizAttempt, progress, updateProgress, addSession, concepts } = useStore();
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState<Partial<QuizAttempt> | null>(null);

  // Combine mock quizzes with stored quizzes
  const allQuizzes = [...mockQuizzes, ...quizzes];

  useEffect(() => {
    if (activeQuiz && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeQuiz, timeRemaining, showResults]);

  const startQuiz = (quiz: Quiz) => {
    // Generate questions based on weak areas if available
    let questions = mockQuestions;
    if (concepts.length > 0) {
      // Prioritize questions from weak concepts
      const weakConceptIds = progress.weakAreas;
      questions = mockQuestions.sort((a, b) => {
        const aIsWeak = weakConceptIds.includes(a.conceptId) ? 1 : 0;
        const bIsWeak = weakConceptIds.includes(b.conceptId) ? 1 : 0;
        return bIsWeak - aIsWeak;
      });
    }

    const quizWithQuestions = { ...quiz, questions };
    setActiveQuiz(quizWithQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(quiz.timeLimit * 60);
    setShowResults(false);
    setQuizAttempt({
      quizId: quiz.id,
      startedAt: new Date(),
      answers: {},
    });
  };

  const handleAnswer = (answer: string | string[]) => {
    const currentQuestion = activeQuiz?.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!activeQuiz || !quizAttempt) return;

    const completedAt = new Date();
    const timeSpent = activeQuiz.timeLimit * 60 - timeRemaining;

    // Calculate score
    let correct = 0;
    const weakAreas: string[] = [];
    
    activeQuiz.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      const isCorrect = Array.isArray(q.correctAnswer)
        ? JSON.stringify((userAnswer as string[])?.slice().sort()) === JSON.stringify(q.correctAnswer.slice().sort())
        : userAnswer === q.correctAnswer;

      if (isCorrect) {
        correct++;
      } else {
        weakAreas.push(q.conceptId);
      }
    });

    const score = Math.round((correct / activeQuiz.questions.length) * 100);

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: activeQuiz.id,
      startedAt: quizAttempt.startedAt!,
      completedAt,
      answers,
      score,
      timeSpent,
      weakAreas,
    };

    addQuizAttempt(attempt);
    setQuizAttempt(attempt);
    setShowResults(true);

    // Update progress
    const newAverage =
      (progress.averageScore * progress.quizzesTaken + score) /
      (progress.quizzesTaken + 1);
    
    updateProgress({
      quizzesTaken: progress.quizzesTaken + 1,
      averageScore: Math.round(newAverage),
      weakAreas: [...new Set([...progress.weakAreas, ...weakAreas])],
    });

    // Add study session
    addSession({
      id: `session-${Date.now()}`,
      date: new Date(),
      duration: Math.floor(timeSpent / 60),
      activityType: 'quiz',
      conceptIds: activeQuiz.questions.map((q) => q.conceptId),
      performance: score,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (showResults && quizAttempt) {
    const score = quizAttempt.score || 0;
    const totalQuestions = activeQuiz?.questions.length || 0;
    const correct = Math.round((score / 100) * totalQuestions);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Quiz Complete!</h1>
          <p className="text-muted-foreground mt-1">
            Here's how you performed on {activeQuiz?.title}
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className={`
                w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4
                ${score >= 80 ? 'bg-success/20' : score >= 60 ? 'bg-warning/20' : 'bg-destructive/20'}
              `}>
                <Trophy className={`
                  h-12 w-12
                  ${score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-destructive'}
                `} />
              </div>
              <p className="text-5xl font-bold">{score}%</p>
              <p className="text-muted-foreground mt-2">
                {correct} out of {totalQuestions} correct
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-muted">
                <p className="text-2xl font-bold">{correct}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted">
                <p className="text-2xl font-bold">{totalQuestions - correct}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted">
                <p className="text-2xl font-bold">
                  {formatTime(quizAttempt.timeSpent || 0)}
                </p>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
            </div>

            {quizAttempt.weakAreas && quizAttempt.weakAreas.length > 0 && (
              <div className="p-4 rounded-xl bg-warning/10 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <p className="font-medium">Areas to Review</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  We identified {quizAttempt.weakAreas.length} concepts that need more practice.
                  Review these topics to improve your score.
                </p>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Back to Quizzes
              </Button>
              <Button onClick={() => activeQuiz && startQuiz(activeQuiz)} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeQuiz) {
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{activeQuiz.title}</h1>
            <p className="text-muted-foreground mt-1">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        {/* Question Card */}
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <div className="mb-6">
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
            </div>

            <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

            {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
              <RadioGroup
                value={(answers[currentQuestion.id] as string) || ''}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                      ${answers[currentQuestion.id] === option
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'}
                    `}
                    onClick={() => handleAnswer(option)}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'true_false' && currentQuestion.options && (
              <RadioGroup
                value={(answers[currentQuestion.id] as string) || ''}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                      ${answers[currentQuestion.id] === option
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'}
                    `}
                    onClick={() => handleAnswer(option)}
                  >
                    <RadioGroupItem value={option} id={`tf-${index}`} />
                    <Label htmlFor={`tf-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            <div className="mt-8 flex justify-end">
              <Button
                onClick={nextQuestion}
                disabled={!answers[currentQuestion.id]}
                className="gap-2"
              >
                {currentQuestionIndex === activeQuiz.questions.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Practice Tests</h1>
          <p className="text-muted-foreground mt-1">
            Test your knowledge with adaptive quizzes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-2xl font-bold">{progress.averageScore}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.quizzesTaken}</p>
              <p className="text-sm text-muted-foreground">Quizzes Taken</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round((progress.averageScore / 100) * progress.quizzesTaken * 10) || 0}
              </p>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.averageScore}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allQuizzes.map((quiz) => (
          <Card key={quiz.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground">{quiz.description}</p>
                </div>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" />
                  {quiz.questions.length || 5} questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {quiz.timeLimit} min
                </span>
              </div>

              <Button
                onClick={() => startQuiz(quiz)}
                className="w-full gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
