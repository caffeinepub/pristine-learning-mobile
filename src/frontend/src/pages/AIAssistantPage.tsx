import React, { useState } from 'react';
import {
  FileText,
  HelpCircle,
  BookOpen,
  ClipboardList,
  LayoutGrid,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import AIToolCard from '../components/AIToolCard';
import AIToolModal from '../components/AIToolModal';
import { AIToolType } from '../utils/mockAIResponses';

interface Tool {
  type: AIToolType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const tools: Tool[] = [
  {
    type: 'worksheet',
    title: 'Generate Worksheet',
    description: 'Create practice worksheets with exercises',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-primary/10 text-primary',
  },
  {
    type: 'quiz',
    title: 'Create Quiz',
    description: 'Build multiple-choice quizzes instantly',
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'bg-chart-2/20 text-chart-2',
  },
  {
    type: 'lessonPlan',
    title: 'Draft Lesson Plan',
    description: 'Structure a complete 45-minute lesson',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-chart-3/20 text-chart-3',
  },
  {
    type: 'questionPaper',
    title: 'Question Paper',
    description: 'Generate full exam question papers',
    icon: <ClipboardList className="w-5 h-5" />,
    color: 'bg-chart-4/20 text-chart-4',
  },
  {
    type: 'rubric',
    title: 'Create Rubric',
    description: 'Design assessment rubrics with criteria',
    icon: <LayoutGrid className="w-5 h-5" />,
    color: 'bg-chart-5/20 text-chart-5',
  },
  {
    type: 'teachingStrategies',
    title: 'Teaching Strategies',
    description: 'Get personalized pedagogical suggestions',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'bg-warm-400/20 text-warm-500',
  },
];

export default function AIAssistantPage() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  return (
    <div className="p-4 space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-foreground">AI Assistant</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Generate teaching materials tailored to your grade, subject, and curriculum
        </p>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-4">
        <p className="text-sm font-semibold text-foreground mb-1">✨ AI-Powered Teaching Tools</p>
        <p className="text-xs text-muted-foreground">
          Select a tool below, fill in the details, and get professionally formatted content in seconds.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="space-y-2">
        <h3 className="font-serif font-semibold text-sm text-foreground">Choose a Tool</h3>
        {tools.map((tool) => (
          <AIToolCard
            key={tool.type}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            color={tool.color}
            onClick={() => setActiveTool(tool)}
          />
        ))}
      </div>

      {/* Modal */}
      {activeTool && (
        <AIToolModal
          open={!!activeTool}
          onClose={() => setActiveTool(null)}
          toolType={activeTool.type}
          toolTitle={activeTool.title}
        />
      )}
    </div>
  );
}
