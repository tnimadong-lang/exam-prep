import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  Video,
  Headphones,
  ExternalLink,
  Star,
  Clock,
  Search,
  Filter,
  Sparkles,
  GraduationCap,
  FileText,
  Bookmark,
  Share2,
} from 'lucide-react';
import type { Resource } from '@/types';

// Mock resources
const mockResources: Resource[] = [
  {
    id: 'res-1',
    title: 'Khan Academy - Mathematics',
    description: 'Comprehensive math courses from basic arithmetic to advanced calculus.',
    url: 'https://www.khanacademy.org/math',
    type: 'course',
    topic: 'Mathematics',
    difficulty: 'beginner',
    estimatedTime: 120,
    rating: 4.9,
  },
  {
    id: 'res-2',
    title: 'Crash Course Physics',
    description: 'Engaging video series covering all major physics topics.',
    url: 'https://www.youtube.com/crashcourse',
    type: 'video',
    topic: 'Physics',
    difficulty: 'intermediate',
    estimatedTime: 45,
    rating: 4.7,
  },
  {
    id: 'res-3',
    title: 'The Feynman Lectures on Physics',
    description: 'Classic physics lectures by Richard Feynman.',
    url: 'https://www.feynmanlectures.caltech.edu/',
    type: 'book',
    topic: 'Physics',
    difficulty: 'advanced',
    estimatedTime: 600,
    rating: 5.0,
  },
  {
    id: 'res-4',
    title: 'Organic Chemistry Tutor',
    description: 'Step-by-step chemistry tutorials and practice problems.',
    url: 'https://www.youtube.com/c/TheOrganicChemistryTutor',
    type: 'video',
    topic: 'Chemistry',
    difficulty: 'intermediate',
    estimatedTime: 60,
    rating: 4.8,
  },
  {
    id: 'res-5',
    title: 'Coursera - Learning How to Learn',
    description: 'Popular course on effective learning techniques.',
    url: 'https://www.coursera.org/learn/learning-how-to-learn',
    type: 'course',
    topic: 'Study Skills',
    difficulty: 'beginner',
    estimatedTime: 180,
    rating: 4.9,
  },
  {
    id: 'res-6',
    title: 'Anki - Spaced Repetition',
    description: 'Powerful flashcard app using spaced repetition.',
    url: 'https://apps.ankiweb.net/',
    type: 'article',
    topic: 'Study Tools',
    difficulty: 'beginner',
    estimatedTime: 30,
    rating: 4.8,
  },
  {
    id: 'res-7',
    title: 'The Study Podcast',
    description: 'Weekly podcast with study tips and motivation.',
    url: '#',
    type: 'podcast',
    topic: 'Study Skills',
    difficulty: 'beginner',
    estimatedTime: 45,
    rating: 4.5,
  },
  {
    id: 'res-8',
    title: 'MIT OpenCourseWare',
    description: 'Free access to MIT course materials.',
    url: 'https://ocw.mit.edu/',
    type: 'course',
    topic: 'Various',
    difficulty: 'advanced',
    estimatedTime: 300,
    rating: 4.9,
  },
];

const topics = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Study Skills', 'Study Tools'];
const types = ['All', 'video', 'article', 'course', 'book', 'podcast'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

export function Resources() {
  const { resources, progress } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const allResources = [...mockResources, ...resources];

  const filteredResources = allResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || resource.topic === selectedTopic;
    const matchesType = selectedType === 'All' || resource.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'All' || resource.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesType && matchesDifficulty;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'course':
        return <GraduationCap className="h-5 w-5" />;
      case 'book':
        return <BookOpen className="h-5 w-5" />;
      case 'podcast':
        return <Headphones className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-600';
      case 'article':
        return 'bg-blue-100 text-blue-600';
      case 'course':
        return 'bg-purple-100 text-purple-600';
      case 'book':
        return 'bg-green-100 text-green-600';
      case 'podcast':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success/20 text-success';
      case 'intermediate':
        return 'bg-warning/20 text-warning';
      case 'advanced':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  // Get recommended resources based on weak areas
  const recommendedResources = allResources.filter((r) =>
    progress.weakAreas.some((area) =>
      r.topic.toLowerCase().includes(area.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Learning Resources</h1>
          <p className="text-muted-foreground mt-1">
            Curated resources to boost your learning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      {recommendedResources.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="flex gap-4">
                {recommendedResources.slice(0, 3).map((resource) => (
                  <Card
                    key={resource.id}
                    className="min-w-[300px] card-hover cursor-pointer"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${getTypeColor(resource.type)} flex items-center justify-center flex-shrink-0`}>
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(resource.estimatedTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3 pl-6">
            {types.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3 pl-6">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="card-hover group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${getTypeColor(resource.type)} flex items-center justify-center`}>
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold mb-2">{resource.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {resource.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {resource.rating}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(resource.estimatedTime)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  Open
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No resources found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters or search query
          </p>
        </Card>
      )}
    </div>
  );
}
