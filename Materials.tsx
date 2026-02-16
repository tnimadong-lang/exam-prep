import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Upload,
  FileText,
  Image,
  Video,
  File,
  CheckCircle,
  Sparkles,
  Brain,
  Download,
  Trash2,
  Eye,
} from 'lucide-react';
import type { StudyMaterial, Concept } from '@/types';

// Mock AI extraction function
const extractConceptsFromMaterial = (material: StudyMaterial): Concept[] => {
  const concepts: Concept[] = [
    {
      id: `concept-${Date.now()}-1`,
      materialId: material.id,
      title: 'Key Concept 1',
      description: 'This is an important concept extracted from your material.',
      difficulty: 'medium',
      masteryLevel: 0,
      relatedConcepts: [],
      flashcards: [],
    },
    {
      id: `concept-${Date.now()}-2`,
      materialId: material.id,
      title: 'Key Concept 2',
      description: 'Another essential concept for your exam preparation.',
      difficulty: 'hard',
      masteryLevel: 0,
      relatedConcepts: [`concept-${Date.now()}-1`],
      flashcards: [],
    },
    {
      id: `concept-${Date.now()}-3`,
      materialId: material.id,
      title: 'Fundamental Principle',
      description: 'A foundational principle you need to understand.',
      difficulty: 'easy',
      masteryLevel: 0,
      relatedConcepts: [],
      flashcards: [],
    },
  ];
  return concepts;
};

export function Materials() {
  const { materials, addMaterial, removeMaterial, addConcept, addFlashcard } = useStore();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', content: '' });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        setUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 10;
          });
        }, 200);

        // Read file content
        const content = await file.text().catch(() => 'Content extraction in progress...');

        setTimeout(() => {
          clearInterval(progressInterval);
          setUploadProgress(100);

          const material: StudyMaterial = {
            id: `material-${Date.now()}`,
            name: file.name,
            type: file.type.includes('pdf')
              ? 'pdf'
              : file.type.includes('image')
              ? 'image'
              : file.type.includes('video')
              ? 'video'
              : 'doc',
            content: content.slice(0, 5000), // Limit content length
            uploadedAt: new Date(),
            size: file.size,
            extractedConcepts: [],
          };

          addMaterial(material);
          setUploading(false);
          setUploadProgress(0);

          // Auto-analyze
          handleAnalyze(material);
        }, 2500);
      }
    },
    [addMaterial]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.doc', '.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: true,
  });

  const handleAnalyze = async (material: StudyMaterial) => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const concepts = extractConceptsFromMaterial(material);
      concepts.forEach((concept) => {
        addConcept(concept);
        // Create flashcards for each concept
        const flashcard = {
          id: `flashcard-${concept.id}`,
          conceptId: concept.id,
          front: `What is ${concept.title}?`,
          back: concept.description,
          difficulty: concept.difficulty,
          lastReviewed: null,
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          reviewCount: 0,
          correctStreak: 0,
        };
        addFlashcard(flashcard);
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleAddManualMaterial = () => {
    if (!newMaterial.title || !newMaterial.content) return;

    const material: StudyMaterial = {
      id: `material-${Date.now()}`,
      name: newMaterial.title,
      type: 'text',
      content: newMaterial.content,
      uploadedAt: new Date(),
      size: newMaterial.content.length,
      extractedConcepts: [],
    };

    addMaterial(material);
    setNewMaterial({ title: '', content: '' });
    setShowAddDialog(false);
    handleAnalyze(material);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Study Materials</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your exam materials
          </p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-primary to-accent"
          onClick={() => setShowAddDialog(true)}
        >
          <Sparkles className="h-4 w-4" />
          Add Manually
        </Button>
      </div>

      {/* Upload Area */}
      <Card
        {...getRootProps()}
        className={`
          border-2 border-dashed cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
        `}
      >
        <CardContent className="p-8">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragActive ? 'bg-primary scale-110' : 'bg-primary/10'}
            `}>
              <Upload className={`h-8 w-8 ${isDragActive ? 'text-white' : 'text-primary'}`} />
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop files here' : 'Drag & drop your files'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Support for PDF, DOC, TXT, and images
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploading && (
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Uploading...</p>
                <Progress value={uploadProgress} className="h-2 mt-2" />
              </div>
              <span className="text-sm font-medium text-primary">{uploadProgress}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Materials List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {materials.length === 0 ? (
          <Card className="lg:col-span-2">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No materials yet</h3>
              <p className="text-muted-foreground mt-1">
                Upload your first study material to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          materials.map((material) => (
            <Card key={material.id} className="card-hover group">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    {getFileIcon(material.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold truncate">{material.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{formatFileSize(material.size)}</span>
                          <span>•</span>
                          <span>{new Date(material.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeMaterial(material.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {material.extractedConcepts.length} concepts
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {material.type.toUpperCase()}
                      </Badge>
                      {material.extractedConcepts.length > 0 && (
                        <Badge className="text-xs bg-success/20 text-success border-0">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Analyzed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Analysis Dialog */}
      <Dialog open={isAnalyzing} onOpenChange={setIsAnalyzing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              AI Analysis in Progress
            </DialogTitle>
            <DialogDescription>
              Our AI is extracting key concepts and generating flashcards from your material...
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 animate-spin">
                  <div className="absolute top-0 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-primary rounded-full" />
                </div>
                <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
              </div>
              <div className="text-center">
                <p className="font-medium">Extracting concepts...</p>
                <p className="text-sm text-muted-foreground">This may take a moment</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Manual Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Study Material</DialogTitle>
            <DialogDescription>
              Enter your study content manually to create flashcards and quizzes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="e.g., Biology Chapter 5 Notes"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                placeholder="Paste your study notes here..."
                rows={8}
                value={newMaterial.content}
                onChange={(e) => setNewMaterial({ ...newMaterial, content: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              className="gap-2 bg-gradient-to-r from-primary to-accent"
              onClick={handleAddManualMaterial}
              disabled={!newMaterial.title || !newMaterial.content}
            >
              <Sparkles className="h-4 w-4" />
              Analyze & Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
