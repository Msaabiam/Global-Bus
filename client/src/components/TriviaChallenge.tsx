import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, XCircle, ChevronRight, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  fact: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which Tokyo district is famous for anime, manga, and electronics?",
    options: ["Shibuya", "Akihabara", "Ginza", "Shinjuku"],
    correct: 1,
    fact: "Akihabara is known as 'Electric Town' and is the center of Japan's otaku culture!"
  },
  {
    id: 2,
    question: "What is the name of the world's busiest pedestrian crossing located in Tokyo?",
    options: ["The Shibuya Scramble", "Tokyo Crossing", "Harajuku Walk", "Ginza Intersection"],
    correct: 0,
    fact: "The Shibuya Scramble Crossing sees up to 3,000 people cross at a single time!"
  },
  {
    id: 3,
    question: "Which of these is NOT a traditional Japanese food?",
    options: ["Sushi", "Ramen", "Tempura", "Dim Sum"],
    correct: 3,
    fact: "Dim Sum is actually a traditional Cantonese meal from China!"
  }
];

interface TriviaChallengeProps {
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export function TriviaChallenge({ onClose, onComplete }: TriviaChallengeProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === QUESTIONS[currentQ].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      onComplete(score * 100);
      onClose();
    }
  };

  const question = QUESTIONS[currentQ];
  const isCorrect = selected === question.correct;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 to-transparent pointer-events-none" />

        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
               <Brain size={20} />
             </div>
             <div>
               <h3 className="font-display font-bold text-white text-lg">Tokyo Trivia Challenge</h3>
               <p className="text-xs text-white/60">Question {currentQ + 1} of {QUESTIONS.length}</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60">
              {score * 100} XP
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
        </div>

        <div className="p-6 relative z-10">
          <h4 className="text-xl text-white font-medium mb-6 leading-relaxed">
            {question.question}
          </h4>

          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let stateStyles = "bg-white/5 border-white/10 hover:bg-white/10";
              if (showResult) {
                if (idx === question.correct) stateStyles = "bg-green-500/20 border-green-500/50 text-green-200";
                else if (selected === idx) stateStyles = "bg-red-500/20 border-red-500/50 text-red-200";
                else stateStyles = "opacity-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${stateStyles}`}
                  disabled={showResult}
                >
                  <span className="text-white/90">{opt}</span>
                  {showResult && idx === question.correct && <CheckCircle2 className="text-green-400" size={20} />}
                  {showResult && selected === idx && idx !== question.correct && <XCircle className="text-red-400" size={20} />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6"
              >
                <div className={`p-4 rounded-xl mb-4 ${isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                   <p className="text-sm text-white/90">
                     <strong className="block mb-1">{isCorrect ? "Correct!" : "Oops!"}</strong>
                     {question.fact}
                   </p>
                </div>

                <Button onClick={handleNext} className="w-full bg-secondary hover:bg-secondary/90 text-black font-bold h-12 rounded-xl">
                  {currentQ < QUESTIONS.length - 1 ? "Next Question" : "Complete Challenge"} <ChevronRight className="ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
