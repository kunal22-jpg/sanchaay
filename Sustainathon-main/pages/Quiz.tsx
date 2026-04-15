import React, { useState } from 'react';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUESTIONS_POOL: Question[] = [
  {
    id: 1,
    question: "Which of these has the highest carbon footprint per kg?",
    options: ["Chicken", "Beef", "Beans", "Eggs"],
    correctAnswer: 1,
    explanation: "Beef production is extremely resource-intensive, emitting roughly 60kg of CO2 per kg of meat—about 10x more than chicken or fish."
  },
  {
    id: 2,
    question: "What percentage of plastic ever made has been recycled?",
    options: ["~9%", "~25%", "~50%", "~75%"],
    correctAnswer: 0,
    explanation: "Only about 9% of all plastic ever produced has been recycled. The rest sits in landfills, oceans, or is incinerated."
  },
  {
    id: 3,
    question: "What is 'Wish-cycling'?",
    options: ["Buying eco-friendly products", "Recycling more than usual", "Throwing non-recyclables in the bin hoping they'll be recycled", "Riding a bike while dreaming"],
    correctAnswer: 2,
    explanation: "Wish-cycling contaminates recycling streams. If a machine can't process an item (like a greasy pizza box), it may ruin the entire batch of clean recyclables."
  },
  {
    id: 4,
    question: "Which sector emits the most global greenhouse gases?",
    options: ["Transportation", "Agriculture", "Energy (Electricity & Heat)", "Industry"],
    correctAnswer: 2,
    explanation: "Energy production for electricity and heat is the largest source of emissions, accounting for roughly 25-30% of the global total."
  },
  {
    id: 5,
    question: "How many liters of water are needed to make a single cotton T-shirt?",
    options: ["~50L", "~500L", "~1,200L", "~2,700L"],
    correctAnswer: 3,
    explanation: "It takes about 2,700 liters of water to produce one cotton t-shirt—enough for one person to drink for 2.5 years!"
  },
  {
    id: 6,
    question: "What is the fastest-growing waste stream in the world?",
    options: ["Plastic", "Food waste", "E-waste (Electronics)", "Paper"],
    correctAnswer: 2,
    explanation: "Electronic waste is growing at an incredible rate. Only about 20% of global e-waste is formally recycled."
  },
  {
    id: 7,
    question: "How much CO2 can a single mature tree absorb in one year?",
    options: ["~22kg", "~50kg", "~100kg", "~200kg"],
    correctAnswer: 0,
    explanation: "A mature tree absorbs roughly 22kg of CO2 annually. That’s why preserving old-growth forests is so vital for the climate."
  },
  {
    id: 8,
    question: "What term describes appliances drawing power while turned off?",
    options: ["Phantom load", "Battery drain", "Voltage leak", "Dark energy"],
    correctAnswer: 0,
    explanation: "A 'Phantom load' (or Vampire energy) can account for up to 10% of a typical household's energy bill."
  },
  {
    id: 9,
    question: "Which diet generally has the lowest carbon footprint?",
    options: ["Vegetarian", "Vegan", "Paleo", "Keto"],
    correctAnswer: 1,
    explanation: "A vegan diet has the lowest footprint, as plant-based foods require far less land, water, and energy than animal products."
  },
  {
    id: 10,
    question: "On average, how much plastic does a human ingest every week?",
    options: ["5mg", "50mg", "500mg", "5g"],
    correctAnswer: 3,
    explanation: "Studies suggest we could be ingesting up to 5 grams of microplastics a week—the weight of a standard credit card!"
  },
  {
    id: 11,
    question: "Bees contribute to what fraction of global food production?",
    options: ["1/10", "1/5", "1/3", "1/2"],
    correctAnswer: 2,
    explanation: "One out of every three bites of food we eat depends on pollinators like bees. Their decline threatens global food security."
  },
  {
    id: 12,
    question: "What is the most fuel-efficient way to travel for short distances?",
    options: ["Public Bus", "Electric Car", "Walking", "Bicycle"],
    correctAnswer: 3,
    explanation: "Bicycling is incredibly efficient; it uses human power and produces zero emissions while being faster than walking."
  },
  {
    id: 13,
    question: "How many times can a piece of paper be recycled?",
    options: ["Twice", "5 to 7 times", "Up to 20 times", "Infinitely"],
    correctAnswer: 1,
    explanation: "Paper fibers shorten each time they are recycled. Eventually, they become too small to be made into new paper (usually after 5-7 rounds)."
  },
  {
    id: 14,
    question: "What is the most abundant greenhouse gas in Earth's atmosphere?",
    options: ["Carbon Dioxide", "Methane", "Nitrous Oxide", "Water Vapor"],
    correctAnswer: 3,
    explanation: "Water vapor is the most abundant, but Carbon Dioxide is the primary driver of anthropogenic (human-caused) climate change."
  },
  {
    id: 15,
    question: "Recycling one aluminum can saves enough energy to power a TV for how long?",
    options: ["30 minutes", "1 hour", "3 hours", "24 hours"],
    correctAnswer: 2,
    explanation: "Aluminum is highly energy-intensive to mine but very efficient to recycle. One can saves 3 hours of TV power!"
  },
  {
    id: 16,
    question: "LED bulbs use roughly what % less energy than incandescent bulbs?",
    options: ["~25%", "~50%", "~75%", "~90%"],
    correctAnswer: 2,
    explanation: "LEDs use about 75% less energy and last 25 times longer than traditional incandescent lighting."
  },
  {
    id: 17,
    question: "Which of these is a major 'Climate Tipping Point'?",
    options: ["Summer heatwaves", "Amazon rainforest dieback", "Increase in solar panels", "Electric vehicle sales"],
    correctAnswer: 1,
    explanation: "Tipping points are thresholds where a small change can lead to drastic, irreversible effects on the climate system."
  },
  {
    id: 18,
    question: "Ocean acidification is primary caused by the absorption of what?",
    options: ["Plastic", "Oil spills", "Sunlight", "Carbon Dioxide"],
    correctAnswer: 3,
    explanation: "When oceans absorb CO2, it reacts with water to form carbonic acid, making the water more acidic and harming marine life."
  },
  {
    id: 19,
    question: "Where is the 'Great Pacific Garbage Patch' located?",
    options: ["Near Australia", "Between Hawaii and California", "Off the coast of India", "In the Arctic Ocean"],
    correctAnswer: 1,
    explanation: "This massive collection of marine debris and microplastics is twice the size of Texas and located in the North Pacific Subtropical Gyre."
  },
  {
    id: 20,
    question: "Which country produces the highest percentage of its electricity from wind?",
    options: ["USA", "China", "Denmark", "Germany"],
    correctAnswer: 2,
    explanation: "Denmark is a world leader in wind energy, often producing more wind power than its total domestic demand."
  },
  {
    id: 21,
    question: "How much more carbon do peatlands store compared to all global forests?",
    options: ["Half as much", "Roughly the same", "Double the amount", "5 times more"],
    correctAnswer: 2,
    explanation: "Despite covering only 3% of the Earth's surface, peatlands store twice as much carbon as all the world's forests combined!"
  },
  {
    id: 22,
    question: "Which of these is the most effective way to reduce personal flight emissions?",
    options: ["Fly First Class", "Only fly direct routes", "Fly less often", "Use newer planes"],
    correctAnswer: 2,
    explanation: "While direct flights and newer planes help, reducing the frequency of long-haul flights is the only way to significantly cut aviation footprints."
  },
  {
    id: 23,
    question: "How many species are estimated to go extinct each year due to habitat loss?",
    options: ["~100", "~1,000", "~10,000", "~50,000+"],
    correctAnswer: 3,
    explanation: "Scientists estimate that human activities are causing extinctions at a rate 100 to 1,000 times higher than natural background levels."
  },
  {
    id: 24,
    question: "What is the primary material used in most modern solar panels?",
    options: ["Glass", "Aluminum", "Silicon", "Carbon"],
    correctAnswer: 2,
    explanation: "Crystalline silicon is the semiconductor used in 90% of solar panels today to convert sunlight into electricity."
  },
  {
    id: 25,
    question: "Which of these gases has the highest 'Global Warming Potential' over 20 years?",
    options: ["CO2", "Methane", "Nitrous Oxide", "Oxygen"],
    correctAnswer: 1,
    explanation: "Methane is roughly 84 times more potent than CO2 at trapping heat in the atmosphere over a 20-year period."
  }
];

export const Quiz: React.FC<{ onComplete: (xp: number) => void }> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    return [...QUESTIONS_POOL]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5); // Pick 5 random questions per session
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentStep].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onComplete(score * 100); // 100 XP per correct answer
    }
  };

  const restart = () => {
    // Pick 5 new random questions instantly without page reload
    const newSelection = [...QUESTIONS_POOL]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
      
    // Reset all states
    setQuestions(newSelection);
    setCurrentStep(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-12">
        <NeoCard className="text-center p-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-neo-green"></div>
          <Trophy size={80} className="mx-auto text-neo-yellow mb-6" />
          <h2 className="text-4xl font-black mb-4">Quiz Complete!</h2>
          <p className="text-2xl font-bold mb-8">You scored {score}/{questions.length}</p>
          <div className="bg-neo-blue/10 border-2 border-neo-blue p-6 rounded-xl mb-8">
            <p className="text-xl font-bold text-neo-blue">+{score * 100} XP Earned!</p>
          </div>
          <div className="flex gap-4 justify-center">
             <NeoButton onClick={restart} variant="outline"><RefreshCcw className="mr-2" /> Try Again (New Quest)</NeoButton>
          </div>
        </NeoCard>
      </motion.div>
    );
  }

  const q = questions[currentStep];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black">Eco-Quiz</h2>
          <p className="text-gray-500 font-bold">Question {currentStep + 1} of {questions.length}</p>
        </div>
        <div className="text-2xl font-black">Score: {score}</div>
      </div>

      <NeoCard className="p-8">
        <h3 className="text-2xl font-bold mb-8">{q.question}</h3>
        <div className="space-y-4">
          {q.options.map((option, index) => {
            const isCorrect = index === q.correctAnswer;
            const isSelected = index === selectedOption;
            
            let bgClass = "bg-white";
            if (isAnswered) {
              if (isCorrect) bgClass = "bg-green-100 border-green-500";
              else if (isSelected) bgClass = "bg-red-100 border-red-500";
            } else {
              bgClass = "hover:bg-neo-yellow/20";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 border-black font-bold transition-all flex items-center justify-between ${bgClass} ${isSelected ? 'shadow-neo-sm -translate-y-1' : ''}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="text-green-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              className="mt-8 p-6 bg-gray-50 border-2 border-dashed border-black rounded-xl"
            >
              <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                {selectedOption === q.correctAnswer ? "✨ Correct!" : "💡 Did you know?"}
              </h4>
              <p className="text-gray-700 font-medium">{q.explanation}</p>
              <NeoButton onClick={nextQuestion} className="mt-6 w-full">
                {currentStep === questions.length - 1 ? "Finish Quiz" : "Next Question"} <ArrowRight className="ml-2" />
              </NeoButton>
            </motion.div>
          )}
        </AnimatePresence>
      </NeoCard>
    </div>
  );
};
