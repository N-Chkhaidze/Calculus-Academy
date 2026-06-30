export type { StudentProfile } from './firebase';

export interface LessonTopic {
  id: string;
  index: number;
  titleGe: string;
  titleEn: string;
  taglineGe: string;
  taglineEn: string;
  descriptionGe: string;
  unlockedAtPoints: number;
  icon: string;
  colorClass: string;
  gradientClass: string;
}

export interface QuizQuestion {
  id: string;
  questionTextGe: string;
  optionsGe: string[];
  correctIndex: number;
  explanationGe: string;
}

export interface QuizSet {
  topicId: string;
  questions: QuizQuestion[];
}

export interface BadgeDefinition {
  id: string;
  titleGe: string;
  descriptionGe: string;
  iconName: string;
  colorClass: string;
}

export interface ReferenceSource {
  title: string;
  category: 'Books' | 'Websites' | 'Research';
  author: string;
  link: string;
  descriptionGe: string;
}
