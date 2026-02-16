import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  StudyMaterial,
  Concept,
  Flashcard,
  Quiz,
  QuizAttempt,
  StudySession,
  UserProgress,
  Achievement,
  Resource,
  StudyPlan,
  UserStats,
} from '@/types';

interface AppState {
  // Materials
  materials: StudyMaterial[];
  addMaterial: (material: StudyMaterial) => void;
  removeMaterial: (id: string) => void;
  
  // Concepts
  concepts: Concept[];
  addConcept: (concept: Concept) => void;
  updateConceptMastery: (id: string, level: number) => void;
  
  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Flashcard) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  getDueFlashcards: () => Flashcard[];
  
  // Quizzes
  quizzes: Quiz[];
  addQuiz: (quiz: Quiz) => void;
  quizAttempts: QuizAttempt[];
  addQuizAttempt: (attempt: QuizAttempt) => void;
  
  // Study Sessions
  sessions: StudySession[];
  addSession: (session: StudySession) => void;
  
  // Progress
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  
  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  
  // Resources
  resources: Resource[];
  addResource: (resource: Resource) => void;
  
  // Study Plans
  studyPlans: StudyPlan[];
  addStudyPlan: (plan: StudyPlan) => void;
  
  // Stats
  stats: UserStats;
  updateStats: (updates: Partial<UserStats>) => void;
  
  // UI State
  currentView: 'dashboard' | 'materials' | 'flashcards' | 'quizzes' | 'progress' | 'resources' | 'plan';
  setCurrentView: (view: AppState['currentView']) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const initialProgress: UserProgress = {
  totalStudyTime: 0,
  sessionsCompleted: 0,
  flashcardsReviewed: 0,
  quizzesTaken: 0,
  averageScore: 0,
  streakDays: 0,
  lastStudyDate: null,
  conceptMastery: {},
  weakAreas: [],
  strongAreas: [],
};

const initialStats: UserStats = {
  confidenceScore: 50,
  readinessScore: 30,
  consistencyScore: 50,
  overallProgress: 0,
};

const initialAchievements: Achievement[] = [
  {
    id: 'first_upload',
    title: 'First Steps',
    description: 'Upload your first study material',
    icon: 'Upload',
    unlockedAt: null,
    requirement: 1,
    current: 0,
  },
  {
    id: 'flashcard_master',
    title: 'Flashcard Master',
    description: 'Review 100 flashcards',
    icon: 'Layers',
    unlockedAt: null,
    requirement: 100,
    current: 0,
  },
  {
    id: 'quiz_champion',
    title: 'Quiz Champion',
    description: 'Score 90% or higher on 5 quizzes',
    icon: 'Trophy',
    unlockedAt: null,
    requirement: 5,
    current: 0,
  },
  {
    id: 'streak_keeper',
    title: 'Streak Keeper',
    description: 'Study for 7 consecutive days',
    icon: 'Flame',
    unlockedAt: null,
    requirement: 7,
    current: 0,
  },
  {
    id: 'concept_explorer',
    title: 'Concept Explorer',
    description: 'Master 20 concepts',
    icon: 'Lightbulb',
    unlockedAt: null,
    requirement: 20,
    current: 0,
  },
  {
    id: 'dedicated_learner',
    title: 'Dedicated Learner',
    description: 'Study for 50 total hours',
    icon: 'Clock',
    unlockedAt: null,
    requirement: 50,
    current: 0,
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Materials
      materials: [],
      addMaterial: (material) => {
        set((state) => ({ materials: [...state.materials, material] }));
        // Check first upload achievement
        const achievements = get().achievements;
        const firstUpload = achievements.find(a => a.id === 'first_upload');
        if (firstUpload && firstUpload.current === 0) {
          get().unlockAchievement('first_upload');
        }
      },
      removeMaterial: (id) =>
        set((state) => ({
          materials: state.materials.filter((m) => m.id !== id),
        })),

      // Concepts
      concepts: [],
      addConcept: (concept) =>
        set((state) => ({ concepts: [...state.concepts, concept] })),
      updateConceptMastery: (id, level) =>
        set((state) => ({
          concepts: state.concepts.map((c) =>
            c.id === id ? { ...c, masteryLevel: level } : c
          ),
          progress: {
            ...state.progress,
            conceptMastery: { ...state.progress.conceptMastery, [id]: level },
          },
        })),

      // Flashcards
      flashcards: [],
      addFlashcard: (flashcard) =>
        set((state) => ({ flashcards: [...state.flashcards, flashcard] })),
      updateFlashcard: (id, updates) =>
        set((state) => ({
          flashcards: state.flashcards.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),
      getDueFlashcards: () => {
        const now = new Date();
        return get().flashcards.filter(
          (f) => !f.nextReview || new Date(f.nextReview) <= now
        );
      },

      // Quizzes
      quizzes: [],
      addQuiz: (quiz) =>
        set((state) => ({ quizzes: [...state.quizzes, quiz] })),
      quizAttempts: [],
      addQuizAttempt: (attempt) =>
        set((state) => ({ quizAttempts: [...state.quizAttempts, attempt] })),

      // Study Sessions
      sessions: [],
      addSession: (session) =>
        set((state) => {
          const newSessions = [...state.sessions, session];
          const totalTime = newSessions.reduce((sum, s) => sum + s.duration, 0);
          return {
            sessions: newSessions,
            progress: {
              ...state.progress,
              totalStudyTime: totalTime,
              sessionsCompleted: newSessions.length,
            },
          };
        }),

      // Progress
      progress: initialProgress,
      updateProgress: (updates) =>
        set((state) => ({
          progress: { ...state.progress, ...updates },
        })),

      // Achievements
      achievements: initialAchievements,
      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id
              ? { ...a, unlockedAt: a.unlockedAt || new Date(), current: a.current + 1 }
              : a
          ),
        })),

      // Resources
      resources: [],
      addResource: (resource) =>
        set((state) => ({ resources: [...state.resources, resource] })),

      // Study Plans
      studyPlans: [],
      addStudyPlan: (plan) =>
        set((state) => ({ studyPlans: [...state.studyPlans, plan] })),

      // Stats
      stats: initialStats,
      updateStats: (updates) =>
        set((state) => ({
          stats: { ...state.stats, ...updates },
        })),

      // UI State
      currentView: 'dashboard',
      setCurrentView: (view) => set({ currentView: view }),
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'exam-prep-storage',
      partialize: (state) => ({
        materials: state.materials,
        concepts: state.concepts,
        flashcards: state.flashcards,
        quizzes: state.quizzes,
        quizAttempts: state.quizAttempts,
        sessions: state.sessions,
        progress: state.progress,
        achievements: state.achievements,
        resources: state.resources,
        studyPlans: state.studyPlans,
        stats: state.stats,
      }),
    }
  )
);
