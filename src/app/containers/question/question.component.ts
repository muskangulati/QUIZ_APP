import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { QuizQuestion } from '../../model/quiz-question';

@Component({
  selector: 'codelab-question-container',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  @Input() answer: string;
  @Input() formGroup: FormGroup;
  @Output() question: QuizQuestion;
  totalQuestions: number;
  completionTime: number;
  correctAnswersCount = 0;

  questionID = 0;
  currentQuestion = 0;
  questionIndex: number;
  correctAnswer: boolean;
  hasAnswer: boolean;
  disabled: boolean;
  quizIsOver: boolean;
  progressValue: number;
  timeLeft: number;
  timePerQuestion = 20;
  interval: any;
  elapsedTime: number;
  elapsedTimes = [];

  blueBorder = '2px solid #007aff';

  allQuestions: QuizQuestion[] = [
    {
      questionId: 1,
      questionText: 'What is the objective of dependency injection?',
      options: [
        { optionValue: '1', optionText: 'Pass the service to the client.' },
        { optionValue: '2', optionText: 'Allow the client to find service.' },
        { optionValue: '3', optionText: 'Allow the client to build service.' },
        { optionValue: '4', optionText: 'Give the client part service.' }
      ],
      answer: '1',
      explanation: 'A service gets passed to the client during DI',
      selectedOption: ''
    },
    {
      questionId: 2,
      questionText: 'Which of the following is not JavaScript Data Types?',
      options: [
        { optionValue: '1', optionText: 'Undefined' },
        { optionValue: '2', optionText: 'Number' },
        { optionValue: '3', optionText: 'Boolean' },
        { optionValue: '4', optionText: 'Float' },
      ],
      answer: '4',
      explanation: 'The JavaScript Data types are: Number, String, Boolean, Object,Undefined',
      selectedOption: ''
    },
    {
      questionId: 3,
      questionText: 'Which of the following is the first step in setting up dependency injection?',
      options: [
        { optionValue: '1', optionText: 'Require in the component.' },
        { optionValue: '2', optionText: 'Provide in the module.' },
        { optionValue: '3', optionText: 'Mark dependency as @Injectable().' },
        { optionValue: '4', optionText: 'Declare an object.' }
      ],
      answer: '3',
      explanation: 'the first step is marking the class as @Injectable()',
      selectedOption: ''
    },
    {
        questionId: 4,
        questionText: 'What does the method Performance.now() return?',
        options: [
          { optionValue: '1', optionText: 'DOMTimeStamp' },
          { optionValue: '2', optionText: 'DOMHighResTimeStamp' },
          { optionValue: '3', optionText: 'DOM\Stamp' },
          { optionValue: '4', optionText: 'TimeStamp' },
        ],
        answer: '2',
        explanation: 'The Performance.now() method returns a DOMHighResTimeStamp, measured in milliseconds, accurate to one thousandth of a millisecond equal to the number of milliseconds',
        selectedOption: ''
      },
      {
        questionId: 5,
        questionText: 'How many bits are there in one Byte??',
        options: [
          { optionValue: '1', optionText: '8 bits' },
          { optionValue: '2', optionText: '4 bits' },
          { optionValue: '3', optionText: '2 bits' },
          { optionValue: '4', optionText: '16 bits' },
        ],
        answer: '1',
        explanation: 'There are 8 bits in 1 byte.',
        selectedOption: ''
      },
    {
      questionId: 6,
      questionText: 'What does it indicate when the type attribute of the navigation object is set to 2?',
      options: [
        { optionValue: '1', optionText: 'Navigation by moving back through history' },
        { optionValue: '2', optionText: 'Navigation by moving forward through history' },
        { optionValue: '3', optionText: 'Navigation by moving back & forward through history' },
        { optionValue: '4', optionText: 'Navigation by moving in favorites' },
      ],
      answer: '3',
      explanation: 'The navigator object contains information about the browser. ',
      selectedOption: ''
    },
    {
      questionId: 7,
      questionText: 'Which of the following computation is correct to calculate the time taken for page load once the page is received from the server?',
      options: [
        { optionValue: '1', optionText: 'responseEnd-loadEventEnd' },
        { optionValue: '2', optionText: 'loadEventEnd-responseEnd' },
        { optionValue: '3', optionText: 'loadEventEnd/responseEnd' },
        { optionValue: '4', optionText: 'responseEnd/loadEventEnd' },
      ],
      answer: '2',
      explanation: 'The legacy PerformanceTiming.loadEventEnd read-only property returns an unsigned long representing the moment, in milliseconds .',
      selectedOption: ''
    },
    {
      questionId: 8,
      questionText: 'What is the purpose of the timing property in the window.performance object?',
      options: [
        { optionValue: '1', optionText: 'Time of navigation event' },
        { optionValue: '2', optionText: 'Time of page load event' },
        { optionValue: '3', optionText: 'Time of navigation and page load event' },
        { optionValue: '4', optionText: 'Time of scrolling' },
      ],
      answer: '3',
      explanation: ' Each performance.timing attribute shows the time of a navigation event .',
      selectedOption: ''
    },
    {
      questionId: 9,
      questionText: 'In which of the following does dependency injection occur?',
      options: [
        { optionValue: '1', optionText: '@Injectable()' },
        { optionValue: '2', optionText: 'constructor' },
        { optionValue: '3', optionText: 'function' },
        { optionValue: '4', optionText: 'NgModule' },
      ],
      answer: '2',
      explanation: 'object instantiations are taken care of by the constructor in Angular',
      selectedOption: ''
    },
    {
      questionId: 10,
      questionText: 'Which of the following property gives access to the JavaScript memory usage data?',
      options: [
        { optionValue: '1', optionText: 'performance.memory' },
        { optionValue: '2', optionText: 'memory(performance)' },
        { optionValue: '3', optionText: 'performance(memory)' },
        { optionValue: '4', optionText: 'performance()' },
      ],
      answer: '1',
      explanation: 'The property performance.memory gives access to the JavaScript memory usage data. ',
      selectedOption: ''
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.setQuestionID(+params.get('questionId'));  // get the question ID and store it
      this.question = this.getQuestion;
    });
  }

  ngOnInit() {
    this.question = this.getQuestion;
    this.totalQuestions = this.allQuestions.length;
    this.timeLeft = this.timePerQuestion;
    this.progressValue = 100 * (this.currentQuestion + 1) / this.totalQuestions;
    this.countdown();
  }

  displayNextQuestion() {
    this.resetTimer();
    this.increaseProgressValue();

    this.questionIndex = this.questionID++;

    if (typeof document.getElementById('question') !== 'undefined' && this.getQuestionID() <= this.totalQuestions) {
      document.getElementById('question').innerHTML = this.allQuestions[this.questionIndex]['questionText'];
      document.getElementById('question').style.border = this.blueBorder;
    } else {
      this.navigateToResults();
    }
  }

  /* displayPreviousQuestion() {
    this.resetTimer();
    this.decreaseProgressValue();

    this.questionIndex = this.questionID--;

    if (typeof document.getElementById('question') !== 'undefined' && this.getQuestionID() <= this.totalQuestions) {
      document.getElementById('question').innerHTML = this.allQuestions[this.questionIndex]['questionText'];
      document.getElementById('question').style.border = this.blueBorder;
    } else {
      this.navigateToResults();
    }
  } */

  navigateToNextQuestion(): void {
    this.router.navigate(['/question', this.getQuestionID() + 1]);
    this.displayNextQuestion();
  }

  /* navigateToPreviousQuestion(): void {
    this.router.navigate(['/question', this.getQuestionID() - 1]);
    this.displayPreviousQuestion();
  } */

  navigateToResults(): void {
    this.router.navigate(['/results'], { state:
      {
        totalQuestions: this.totalQuestions,
        correctAnswersCount: this.correctAnswersCount,
        completionTime: this.completionTime,
        allQuestions: this.allQuestions
      }
    });
  }

  checkIfAnsweredCorrectly() {
    if (this.isThereAnotherQuestion() && this.isCorrectAnswer()) {
      this.incrementCorrectAnswersCount();
      this.correctAnswer = true;
      this.hasAnswer = true;
      this.disabled = false;

      this.elapsedTime = Math.ceil(this.timePerQuestion - this.timeLeft);
      if (this.getQuestionID() < this.totalQuestions) {
        this.elapsedTimes = [...this.elapsedTimes, this.elapsedTime];
      } else {
        this.elapsedTimes = [...this.elapsedTimes, 0];
        this.completionTime = this.calculateTotalElapsedTime(this.elapsedTimes);
      }

      this.quizDelay(3000);

      if (this.getQuestionID() < this.totalQuestions) {
        this.navigateToNextQuestion();
      } else {
        this.navigateToResults();
      }
    }
  }

  incrementCorrectAnswersCount() {
    if (this.questionID <= this.totalQuestions && this.isCorrectAnswer()) {
      if (this.correctAnswersCount === this.totalQuestions) {
        return this.correctAnswersCount;
      } else {
        this.correctAnswer = true;
        this.hasAnswer = true;
        return this.correctAnswersCount++;
      }
    } else {
      this.correctAnswer = false;
      this.hasAnswer = false;
    }
  }

  increaseProgressValue() {
    this.progressValue = parseFloat((100 * (this.getQuestionID() + 1) / this.totalQuestions).toFixed(1));
  }

  /* decreaseProgressValue() {
    this.progressValue = parseFloat((100 * (this.getQuestionID() - 1) / this.totalQuestions).toFixed(1));
  } */

  calculateTotalElapsedTime(elapsedTimes) {
    return this.completionTime = elapsedTimes.reduce((acc, cur) => acc + cur, 0);
  }

  /****************  public API  ***************/
  getQuestionID() {
    return this.questionID;
  }

  setQuestionID(id: number) {
    return this.questionID = id;
  }

  isThereAnotherQuestion(): boolean {
    return this.questionID <= this.allQuestions.length;
  }

  isFinalQuestion(): boolean {
    return this.currentQuestion === this.totalQuestions;
  }

  isCorrectAnswer(): boolean {
    return this.question.selectedOption === this.question.answer;
  }

  get getQuestion(): QuizQuestion {
    return this.allQuestions.filter(
      question => question.questionId === this.questionID
    )[0];
  }

  // countdown clock
  private countdown() {
    if (this.questionID <= this.totalQuestions) {
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          this.checkIfAnsweredCorrectly();

          if (this.correctAnswersCount <= this.totalQuestions) {
            this.calculateTotalElapsedTime(this.elapsedTimes);
          }
          if (this.timeLeft === 0 && !this.isFinalQuestion()) {
            this.navigateToNextQuestion();
          }
          if (this.timeLeft === 0 && this.isFinalQuestion()) {
            this.navigateToResults();
          }
          if (this.isFinalQuestion() && this.hasAnswer === true) {
            this.navigateToResults();
            this.quizIsOver = true;
          }

          // disable the next button until an option has been selected
          this.question.selectedOption === '' ? this.disabled = true : this.disabled = false;
        }
      }, 1000);
    }
  }

  private resetTimer() {
    this.timeLeft = this.timePerQuestion;
  }

  quizDelay(milliseconds) {
    const start = new Date().getTime();
    let counter = 0;
    let end = 0;

    while (counter < milliseconds) {
      end = new Date().getTime();
      counter = end - start;
    }
  }
}
