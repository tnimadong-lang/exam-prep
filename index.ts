// Study Material Types
export interface StudyMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'text' | 'video';
  content: string;
  uploadedAt: Date;
  size: number;
  extractedConcepts: Concept[];
}

export interface Concept {
  id: string;
  materialId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryLevel: number; // 0-100
  relatedConcepts: string[];
  flashcards: Flashcard[];
}

export interface Flashcard {
  id: string;
  conceptId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: Date | null;
  nextReview: Date;
  reviewCount: number;
  correctStreak: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  conceptIds: string[];
  createdAt: Date;
}

export interface Question {
  id: string;
  quizId: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  conceptId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  startedAt: Date;
  completedAt: Date | null;
  answers: Record<string, string | string[]>;
  score: number | null;
  timeSpent: number; // in seconds
  weakAreas: string[];
}

export interface StudySession {
  id: string;
  date: Date;
  duration: number; // in minutes
  activityType: 'flashcard' | 'quiz' | 'concept_review' | 'material_upload';
  conceptIds: string[];
  performance: number; // 0-100
}

export interface UserProgress {
  totalStudyTime: number; // in minutes
  sessionsCompleted: number;
  flashcardsReviewed: number;
  quizzesTaken: number;
  averageScore: number;
  streakDays: number;
  lastStudyDate: Date | null;
  conceptMastery: Record<string, number>;
  weakAreas: string[];
  strongAreas: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
  requirement: number;
  current: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'podcast' | 'book' | 'course';
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  rating: number;
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  examDate: Date | null;
  dailyGoals: DailyGoal[];
  topics: string[];
  estimatedHours: number;
}

export interface DailyGoal {
  date: Date;
  tasks: Task[];
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  type: 'flashcard_review' | 'quiz_practice' | 'concept_study' | 'material_reading';
  conceptIds: string[];
  estimatedTime: number;
  completed: boolean;
}

export interface UserStats {
  confidenceScore: number; // 0-100
  readinessScore: number; // 0-100
  consistencyScore: number; // 0-100
  overallProgress: number; // 0-100
}
