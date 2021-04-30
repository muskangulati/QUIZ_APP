import { Option } from './option';

export interface QuizQuestion {
  questionId: number;
  questionText: string;
  options: Option[];
  answer: string;
  explanation: string;
  selectedOption: string;
}
