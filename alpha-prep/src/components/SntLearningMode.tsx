"use client";

import { useState } from "react";
import { CheckCircle2, Circle, BookOpen, BrainCircuit, XCircle, Trophy, RefreshCcw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import curriculumData from "@/data/snt_curriculum.json";
import sntQuizzes from "@/data/snt_quizzes.json";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export function SntLearningMode() {
  const [activeChapterId, setActiveChapterId] = useState(curriculumData[0].id);
  const [quizMode, setQuizMode] = useState(false);
  
  // MCQ States
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // Mock progress tracking (in a real app, this would be saved to DB/LocalStorage)
  const [chapterProgress, setChapterProgress] = useState<Record<string, number>>({
    "chap1": 100,
    "chap2": 100,
    "chap3": 40,
    "chap4": 0,
    "chap5": 0,
    "chap6": 0,
    "chap7": 0,
    "chap8": 0
  });

  const activeChapter = curriculumData.find(c => c.id === activeChapterId)!;
  
  // Calculate total progress
  const totalProgress = Math.round(
    Object.values(chapterProgress).reduce((a, b) => a + b, 0) / curriculumData.length
  );

  // Get quiz questions for the active chapter
  const getChapterQuestions = (): QuizQuestion[] => {
    const allQs = (sntQuizzes as Record<string, QuizQuestion[]>)[activeChapterId] || [];
    return allQs;
  };

  const chapterQuestions = getChapterQuestions();

  const startQuiz = () => {
    const allQs = getChapterQuestions();
    // Randomly select 5 questions
    const shuffled = [...allQs].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuizQuestions(shuffled);
    setQuizIndex(0);
    setUserAnswers({});
    setQuizFinished(false);
    setQuizMode(true);
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (userAnswers[quizIndex] !== undefined) return; // Prevent changing answer
    setUserAnswers(prev => ({ ...prev, [quizIndex]: optionIdx }));
  };

  const handleNextOrSubmit = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      // Calculate score
      setQuizFinished(true);
      const score = quizQuestions.reduce((acc, q, idx) => {
        return acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0);
      }, 0);
      if (score >= 4) {
        setChapterProgress(prev => ({ ...prev, [activeChapterId]: 100 }));
      }
    }
  };

  const currentScore = quizQuestions.reduce((acc, q, idx) => {
    return acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0);
  }, 0);

  // Mock data for Yield Curve visualization
  const yieldCurveData = [
    { maturity: '1Mo', normal: 2.0, flat: 3.0, inverted: 5.0 },
    { maturity: '6Mo', normal: 2.2, flat: 3.0, inverted: 4.8 },
    { maturity: '1Yr', normal: 2.5, flat: 3.0, inverted: 4.5 },
    { maturity: '2Yr', normal: 2.8, flat: 3.0, inverted: 4.0 },
    { maturity: '5Yr', normal: 3.5, flat: 3.1, inverted: 3.5 },
    { maturity: '10Yr', normal: 4.2, flat: 3.1, inverted: 3.0 },
    { maturity: '30Yr', normal: 5.0, flat: 3.2, inverted: 2.5 },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-180px)] min-h-[600px]">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        {/* Total Progress Bento */}
        <div className="bento-card p-5 bg-slate-900 text-white">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Progress</span>
            <span className="text-2xl font-mono font-bold text-finance-blue">{totalProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 mt-2">
            <div className="bg-finance-blue h-2 transition-all duration-500" style={{ width: `${totalProgress}%` }}></div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="bento-card flex-1 flex flex-col overflow-hidden">
          <div className="bento-header bg-white">Syllabus Chapters</div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {curriculumData.map(chapter => {
              const progress = chapterProgress[chapter.id] || 0;
              const isActive = activeChapterId === chapter.id;
              
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setActiveChapterId(chapter.id);
                    setQuizMode(false);
                  }}
                  className={`w-full text-left p-3 flex items-center gap-3 transition-colors border-l-2 ${
                    isActive 
                      ? "bg-slate-50 border-finance-blue" 
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  {progress === 100 ? (
                    <CheckCircle2 className="w-4 h-4 text-finance-blue flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold truncate ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                      {chapter.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-100 h-1">
                        <div 
                          className={`h-1 ${progress === 100 ? 'bg-finance-blue' : 'bg-slate-400'}`} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{progress}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bento-card flex flex-col overflow-hidden">
        
        {!quizMode ? (
          /* Knowledge Learning View */
          <>
            <div className="p-8 border-b border-finance-divider bg-slate-50">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeChapter.title}</h2>
              <p className="text-sm text-slate-600">{activeChapter.description}</p>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-finance-blue" />
                Key Topics Covered
              </h3>
              <ul className="space-y-4 mb-10">
                {activeChapter.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-blue-50 text-finance-blue flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="pt-0.5">{topic}</span>
                  </li>
                ))}
              </ul>

              {/* Study Notes Section */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-finance-divider pb-2">
                  <BookOpen className="w-4 h-4 text-finance-blue" />
                  Study Notes
                </h3>
                <div className="space-y-8">
                  {activeChapter.content?.sections.map((section, idx) => (
                    <div key={idx} className="prose prose-sm max-w-none text-slate-700">
                      {section.title.startsWith("### ") ? (
                        <h4 className="text-sm font-bold text-slate-500 mb-2 mt-8 uppercase tracking-widest">{section.title.replace("### ", "")}</h4>
                      ) : section.title.startsWith("## ") ? (
                        <h3 className="text-xl font-extrabold text-slate-800 mb-4 mt-8 pb-2 border-b border-slate-200">{section.title.replace("## ", "")}</h3>
                      ) : section.title.startsWith("# ") ? (
                        <h2 className="text-3xl font-black text-slate-900 mb-6 mt-10 tracking-tight">{section.title.replace("# ", "")}</h2>
                      ) : (
                        <h4 className="text-base font-bold text-slate-900 mb-3">{section.title}</h4>
                      )}
                      
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {section.body.split('**').map((part, i) => {
                          if (i % 2 === 1) {
                            return <strong key={i} className="text-slate-900">{part}</strong>;
                          }
                          // Handle markdown links: [text](url)
                          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                          const parts = [];
                          let lastIndex = 0;
                          let match;
                          
                          while ((match = linkRegex.exec(part)) !== null) {
                            if (match.index > lastIndex) {
                              parts.push(part.substring(lastIndex, match.index));
                            }
                            parts.push(
                              <a 
                                key={`link-${match.index}`} 
                                href={match[2]} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-finance-blue hover:underline font-medium"
                              >
                                {match[1]}
                              </a>
                            );
                            lastIndex = match.index + match[0].length;
                          }
                          if (lastIndex < part.length) {
                            parts.push(part.substring(lastIndex));
                          }
                          
                          return <span key={i}>{parts}</span>;
                        })}
                      </div>
                      
                      {/* Render Graph if specified in JSON */}
                      {section.graph === "yield-curve" && (
                        <div className="mt-8 mb-4 p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <h5 className="text-sm font-bold text-center text-slate-800 mb-6">U.S. Treasury Yield Curve Shapes</h5>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={yieldCurveData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="maturity" tick={{fontSize: 12, fill: '#64748b'}} axisLine={{stroke: '#cbd5e1'}} tickLine={false} />
                                <YAxis domain={[0, 6]} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                                <Tooltip 
                                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                  formatter={(value: any) => [`${value}%`, '']}
                                />
                                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                                <Line type="monotone" name="Normal Curve" dataKey="normal" stroke="#0052FF" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                                <Line type="monotone" name="Flat Curve" dataKey="flat" stroke="#94a3b8" strokeWidth={2} dot={{r: 3}} />
                                <Line type="monotone" name="Inverted Curve" dataKey="inverted" stroke="#ef4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-6 rounded-sm">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-finance-blue" />
                  Ready to test your knowledge?
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  Take the chapter quiz drawn from real interview questions to complete this section.
                </p>
                <button 
                  onClick={startQuiz}
                  className="btn-primary"
                  disabled={chapterQuestions.length < 5}
                >
                  {chapterQuestions.length >= 5 ? "Start Chapter Quiz" : "No Questions Available"}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Quiz View */
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-finance-divider bg-slate-900 text-white flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider">
                {activeChapter.title} - Quiz
              </span>
              {!quizFinished && (
                <span className="text-sm font-mono font-bold text-finance-blue">
                  {quizIndex + 1} / {quizQuestions.length}
                </span>
              )}
            </div>

            <div className="flex-1 p-8 overflow-y-auto flex flex-col">
              {quizFinished ? (
                /* Results View */
                <div className="flex flex-col items-center justify-center flex-1 text-center max-w-md mx-auto">
                  {currentScore >= 4 ? (
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-6">
                      <Trophy className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6">
                      <XCircle className="w-8 h-8" />
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {currentScore >= 4 ? "Chapter Completed!" : "Keep Trying!"}
                  </h3>
                  <p className="text-slate-600 mb-8">
                    You scored <strong className="text-slate-900">{currentScore} out of 5</strong>.
                    {currentScore >= 4 
                      ? " Excellent work. You've mastered this section." 
                      : " You need at least 4 correct answers to pass this chapter."}
                  </p>
                  
                  <div className="flex gap-4 w-full">
                    {currentScore < 4 && (
                      <button onClick={startQuiz} className="flex-1 btn-primary bg-slate-900 hover:bg-slate-800 text-white border-transparent flex items-center justify-center gap-2">
                        <RefreshCcw className="w-4 h-4" />
                        Retry Quiz
                      </button>
                    )}
                    <button 
                      onClick={() => setQuizMode(false)} 
                      className={`flex-1 btn-primary ${currentScore >= 4 ? '' : 'bg-white text-slate-700 border-finance-divider hover:bg-slate-50'}`}
                    >
                      Return to Syllabus
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Question View */
                <>
                  <div className="mb-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      Question {quizIndex + 1}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {quizQuestions[quizIndex]?.question}
                    </h3>
                  </div>

                  <div className="space-y-3 mb-8">
                    {quizQuestions[quizIndex]?.options.map((option, idx) => {
                      const isSelected = userAnswers[quizIndex] === idx;
                      const hasAnswered = userAnswers[quizIndex] !== undefined;
                      const isCorrect = quizQuestions[quizIndex].correctAnswer === idx;
                      
                      let buttonClass = "w-full text-left p-4 rounded-sm border transition-all ";
                      
                      if (!hasAnswered) {
                        buttonClass += "border-finance-divider hover:border-finance-blue bg-white hover:bg-blue-50";
                      } else {
                        if (isCorrect) {
                          buttonClass += "border-green-500 bg-green-50 text-green-900";
                        } else if (isSelected && !isCorrect) {
                          buttonClass += "border-red-500 bg-red-50 text-red-900";
                        } else {
                          buttonClass += "border-finance-divider bg-slate-50 opacity-50";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={hasAnswered}
                          className={buttonClass}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                              hasAnswered && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                              hasAnswered && isSelected ? 'border-red-500 bg-red-500 text-white' :
                              'border-slate-300 text-slate-500'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="font-medium text-sm">{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {userAnswers[quizIndex] !== undefined && (
                    <div className="mt-auto animate-in fade-in slide-in-from-bottom-4">
                      <div className={`p-4 rounded-sm border mb-6 text-sm ${
                        userAnswers[quizIndex] === quizQuestions[quizIndex].correctAnswer
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}>
                        <strong className="font-bold uppercase tracking-wider text-xs mb-1 block">
                          Explanation
                        </strong>
                        {quizQuestions[quizIndex].explanation}
                      </div>
                      
                      <div className="flex justify-end">
                        <button onClick={handleNextOrSubmit} className="btn-primary">
                          {quizIndex < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}