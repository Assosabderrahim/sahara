import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Info, Trophy, BookOpen, Navigation, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface City {
  id: string;
  name: string;
  description: string;
  history: string;
  landmarks: string[];
  coordinates: { x: number; y: number };
  image: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'quiz' | 'info'>('map');

  useEffect(() => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => setCities(data));
    
    fetch('/api/quiz')
      .then(res => res.json())
      .then(data => setQuizQuestions(data));
  }, []);

  const handleAnswer = (answer: string) => {
    if (answer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen font-sans bg-sand-50">
      {/* Header */}
      <header className="bg-sand-800 text-white py-8 px-4 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-6xl font-serif font-bold mb-2 relative z-10"
        >
          جوهرة الصحراء المغربية
        </motion.h1>
        <p className="text-sand-200 text-lg relative z-10">استكشف تاريخ وجمال الأقاليم الجنوبية للمملكة</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex justify-center gap-4 py-6 sticky top-0 z-40 bg-sand-50/80 backdrop-blur-md border-b border-sand-200">
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'map' ? 'bg-sand-600 text-white shadow-md' : 'text-sand-700 hover:bg-sand-100'}`}
        >
          <Navigation size={20} />
          <span>الخريطة التفاعلية</span>
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'quiz' ? 'bg-sand-600 text-white shadow-md' : 'text-sand-700 hover:bg-sand-100'}`}
        >
          <Trophy size={20} />
          <span>مسابقة المعرفة</span>
        </button>
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'info' ? 'bg-sand-600 text-white shadow-md' : 'text-sand-700 hover:bg-sand-100'}`}
        >
          <BookOpen size={20} />
          <span>بنك المعلومات</span>
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid md:grid-cols-2 gap-8 items-start"
            >
              {/* Map Section */}
              <div className="relative bg-white p-4 rounded-3xl shadow-xl border-4 border-sand-200 aspect-[3/4] overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50"></div>
                {/* Stylized Moroccan Sahara Map (Simplified SVG) */}
                <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-2xl">
                  <path 
                    d="M10,10 L90,10 L90,140 L10,140 Z" 
                    fill="#fef3c7" 
                    stroke="#d97706" 
                    strokeWidth="0.5"
                  />
                  {/* Cities as points */}
                  {cities.map((city) => (
                    <motion.g 
                      key={city.id}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setSelectedCity(city)}
                      className="cursor-pointer"
                    >
                      <circle 
                        cx={city.coordinates.x} 
                        cy={city.coordinates.y} 
                        r="3" 
                        fill={selectedCity?.id === city.id ? "#ef4444" : "#d97706"} 
                        className="animate-pulse"
                      />
                      <text 
                        x={city.coordinates.x + 5} 
                        y={city.coordinates.y + 2} 
                        fontSize="4" 
                        fontWeight="bold"
                        fill="#78350f"
                      >
                        {city.name}
                      </text>
                    </motion.g>
                  ))}
                </svg>
                <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-lg text-xs text-sand-800 font-bold">
                  انقر على مدينة للاستكشاف
                </div>
              </div>

              {/* Detail Section */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {selectedCity ? (
                    <motion.div 
                      key={selectedCity.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="bg-white p-8 rounded-3xl shadow-xl border border-sand-100"
                    >
                      <img 
                        src={selectedCity.image} 
                        alt={selectedCity.name} 
                        className="w-full h-48 object-cover rounded-2xl mb-6 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      <h2 className="text-3xl font-serif font-bold text-sand-800 mb-4">{selectedCity.name}</h2>
                      <p className="text-sand-700 leading-relaxed mb-6">{selectedCity.description}</p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-sand-100 p-2 rounded-lg text-sand-600">
                            <Info size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sand-800">نبذة تاريخية</h4>
                            <p className="text-sm text-sand-600">{selectedCity.history}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-sand-100 p-2 rounded-lg text-sand-600">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sand-800">أهم المعالم</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedCity.landmarks.map(l => (
                                <span key={l} className="bg-sand-50 px-3 py-1 rounded-full text-xs border border-sand-200 text-sand-700">
                                  {l}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-sand-100/50 rounded-3xl border-2 border-dashed border-sand-300">
                      <Navigation size={64} className="text-sand-300 mb-4 animate-float" />
                      <h3 className="text-xl font-bold text-sand-400">اختر مدينة من الخريطة لعرض تفاصيلها</h3>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              {!quizFinished ? (
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-sand-100">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-sand-500 font-bold">السؤال {currentQuestionIndex + 1} من {quizQuestions.length}</span>
                    <div className="h-2 w-32 bg-sand-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sand-500 transition-all duration-500" 
                        style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-sand-800 mb-8">{quizQuestions[currentQuestionIndex]?.question}</h3>
                  
                  <div className="grid gap-4">
                    {quizQuestions[currentQuestionIndex]?.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className="w-full text-right p-4 rounded-xl border-2 border-sand-100 hover:border-sand-500 hover:bg-sand-50 transition-all font-medium text-sand-700 flex items-center justify-between group"
                      >
                        <span>{option}</span>
                        <div className="w-6 h-6 rounded-full border-2 border-sand-200 group-hover:border-sand-500"></div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl shadow-2xl border border-sand-100 text-center">
                  <div className="w-24 h-24 bg-sand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy size={48} className="text-sand-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-sand-800 mb-2">أحسنت!</h2>
                  <p className="text-sand-600 mb-8 text-lg">لقد حصلت على {score} من {quizQuestions.length}</p>
                  <button 
                    onClick={resetQuiz}
                    className="bg-sand-600 text-white px-8 py-3 rounded-full font-bold hover:bg-sand-700 transition-all shadow-lg"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'info' && (
            <motion.div 
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {cities.map(city => (
                <div key={city.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-sand-100 group hover:shadow-xl transition-all">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={city.image} 
                      alt={city.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <h3 className="absolute bottom-4 right-4 text-white text-xl font-bold">{city.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-sand-600 text-sm line-clamp-3 mb-4">{city.description}</p>
                    <button 
                      onClick={() => {
                        setSelectedCity(city);
                        setActiveTab('map');
                      }}
                      className="text-sand-600 font-bold text-sm flex items-center gap-1 hover:text-sand-800"
                    >
                      <span>عرض على الخريطة</span>
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-sand-900 text-sand-400 py-12 mt-20 border-t border-sand-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">مشروع تعليمي تفاعلي حول الصحراء المغربية</p>
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="hover:text-white transition-colors">الرئيسية</a>
            <a href="#" className="hover:text-white transition-colors">عن المشروع</a>
            <a href="#" className="hover:text-white transition-colors">اتصل بنا</a>
          </div>
          <p className="text-xs opacity-50">© 2026 جميع الحقوق محفوظة - فريق الإبداع الرقمي</p>
        </div>
      </footer>
    </div>
  );
}
