import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Search, ChevronRight, MessageCircle, Phone, Mail, Book, Video, FileText } from 'lucide-react';
import Header from '../components/Header';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [activeCategory, setActiveCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'Umumiy savollar', icon: HelpCircle },
    { id: 'registration', label: 'Ro\'yhatdan o\'tish', icon: FileText },
    { id: 'search', label: 'Qidiruv va filtrlar', icon: Search },
    { id: 'applications', label: 'Ariza yuborish', icon: MessageCircle },
    { id: 'payments', label: 'To\'lovlar', icon: Book },
    { id: 'technical', label: 'Texnik yordam', icon: Video }
  ];

  const faqs = {
    general: [
      {
        id: 'what-is-joybor',
        question: 'JoyBor nima?',
        answer: 'JoyBor - bu O\'zbekistondagi talabalar uchun yotoqxona va ijara xonadonlarini topishga yordam beruvchi platforma. Bu yerda siz universitetingizga yaqin, qulay va arzon yashash joylarini topishingiz'
      },
      {
        id: 'how-it-works',
        question: 'Platforma qanday ishlaydi?',
        answer: 'Oddiy 3 bosqichda: 1) Ro\'yhatdan o\'ting, 2) O\'zingizga mos yashash joyini qidiring, 3) Ariza yuboring. Biz sizning arizangizni uy egasi yoki yotoqxona ma\'muriyatiga yetkazamiz.'
      },
      {
        id: 'is-free',
        question: 'Xizmat bepulmi?',
        answer: 'Ha, JoyBor platformasidan foydalanish talabalar uchun mutlaqo bepul. Siz faqat tanlagan yashash joyingiz uchun to\'lov qilasiz.'
      }
    ],
    registration: [
      {
        id: 'how-to-register',
        question: 'Qanday ro\'yhatdan o\'tish mumkin?',
        answer: 'Ro\'yhatdan o\'tish uchun "Ro\'yhatdan o\'tish" tugmasini bosing va kerakli ma\'lumotlarni kiriting: ism-familiya, email, telefon raqam, universitet va talaba ID raqami.'
      },
      {
        id: 'verification',
        question: 'Hisobni tasdiqlash kerakmi?',
        answer: 'Ha, xavfsizlik uchun email manzilingizni tasdiqlashingiz kerak. Shuningdek, talaba ekanligingizni tasdiqlash uchun talaba guvohnomangizni yuklashingiz mumkin.'
      },
      {
        id: 'forgot-password',
        question: 'Parolni unutsam nima qilish kerak?',
        answer: 'Kirish sahifasida "Parolni unutdingizmi?" havolasini bosing. Sizga email orqali parolni tiklash havolasi yuboriladi.'
      }
    ],
    search: [
      {
        id: 'search-tips',
        question: 'Qanday qilib samarali qidiruv qilish mumkin?',
        answer: 'Qidiruv panelida joylashuv, narx oralig\'i, xona turi va qulayliklarni belgilang. Shuningdek, universitetingizga yaqin joylarni qidirish uchun "Universitetgacha masofa" filtridan foydalaning.'
      },
      {
        id: 'save-listings',
        question: 'Yoqqan elonlarni qanday saqlash mumkin?',
        answer: 'Har bir elon kartasida yurak belgisi bor. Uni bosib, elonni "Saqlangan elonlar" bo\'limiga qo\'shishingiz mumkin.'
      },
      {
        id: 'filters',
        question: 'Qanday filtrlar mavjud?',
        answer: 'Narx oralig\'i, joylashuv, xona turi, qulayliklar (WiFi, konditsioner, parking), universitetgacha masofa va boshqa ko\'plab filtrlar mavjud.'
      }
    ],
    applications: [
      {
        id: 'how-to-apply',
        question: 'Qanday ariza yuborish mumkin?',
        answer: 'Yoqqan elonni tanlab, "Ariza yuborish" tugmasini bosing. Keyin 3 bosqichda ma\'lumotlaringizni to\'ldiring: shaxsiy ma\'lumotlar, hujjatlar va afzalliklar.'
      },
      {
        id: 'required-documents',
        question: 'Qanday hujjatlar kerak?',
        answer: 'Asosan talaba guvohnomasi va o\'quv ma\'lumotnomasi talab qilinadi. Ba\'zi hollarda tavsiya xati va pasport nusxasi ham kerak bo\'lishi mumkin.'
      },
      {
        id: 'application-status',
        question: 'Ariza holatini qanday kuzatish mumkin?',
        answer: 'Dashboard sahifasida barcha arizalaringizning holatini ko\'rishingiz mumkin: kutilmoqda, ko\'rib chiqilmoqda, tasdiqlangan yoki rad etilgan.'
      }
    ],
    payments: [
      {
        id: 'payment-methods',
        question: 'Qanday to\'lov usullari mavjud?',
        answer: 'Naqd pul, bank o\'tkazmasi, Click, Payme va boshqa mahalliy to\'lov tizimlari orqali to\'lov qilishingiz mumkin. To\'lov usuli uy egasi bilan kelishiladi.'
      },
      {
        id: 'deposit',
        question: 'Oldindan to\'lov kerakmi?',
        answer: 'Ko\'pincha birinchi oylik to\'lov va kafolat puli (depozit) talab qilinadi. Bu miqdor uy egasi bilan kelishiladi.'
      },
      {
        id: 'refund',
        question: 'Pulni qaytarish mumkinmi?',
        answer: 'Qaytarish shartlari har bir elon uchun alohida belgilanadi. Batafsil ma\'lumot uchun uy egasi bilan bog\'laning.'
      }
    ],
    technical: [
      {
        id: 'browser-support',
        question: 'Qanday brauzerlar qo\'llab-quvvatlanadi?',
        answer: 'Chrome, Firefox, Safari, Edge va boshqa zamonaviy brauzerlarning so\'nggi versiyalari qo\'llab-quvvatlanadi.'
      },
      {
        id: 'mobile-app',
        question: 'Mobil ilova bormi?',
        answer: 'Hozircha mobil ilova ishlab chiqilmoqda. Veb-sayt mobil qurilmalarda to\'liq ishlaydi.'
      },
      {
        id: 'technical-issues',
        question: 'Texnik muammo bo\'lsa nima qilish kerak?',
        answer: 'Sahifani yangilab ko\'ring yoki brauzer keshini tozalang. Muammo davom etsa, yordam xizmatiga murojaat qiling.'
      }
    ]
  };

  const supportOptions = [
    {
      title: 'Jonli chat',
      description: 'Tezkor yordam olish uchun',
      icon: MessageCircle,
      action: () => console.log('Opening chat'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Telefon qo\'ng\'irog\'i',
      description: '+998 71 123 45 67',
      icon: Phone,
      action: () => window.open('tel:+998711234567'),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Email yuborish',
      description: 'help@joybor',
      icon: Mail,
      action: () => window.open('mailto:help@joybor'),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const filteredFaqs = faqs[activeCategory as keyof typeof faqs].filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Yordam Markazi
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            JoyBor platformasidan foydalanish bo'yicha barcha savollaringizga javob toping
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Savolingizni yozing..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 dark:bg-gray-800 dark:text-white shadow-lg"
            />
          </div>
        </motion.div>

        {/* Support Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {supportOptions.map((option) => (
            <motion.button
              key={option.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={option.action}
              className={`p-6 bg-gradient-to-r ${option.color} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <option.icon className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
              <p className="text-sm opacity-90">{option.description}</p>
            </motion.button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Kategoriyalar
              </h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>

              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Hech narsa topilmadi
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Qidiruv so'zingizni o'zgartirib ko'ring yoki boshqa kategoriyani tanlang
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    >
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: expandedFaq === faq.id ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </motion.div>
                      </motion.button>
                      
                      <motion.div
                        initial={false}
                        animate={{
                          height: expandedFaq === faq.id ? 'auto' : 0,
                          opacity: expandedFaq === faq.id ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl p-8 text-white text-center"
            >
              <h3 className="text-2xl font-semibold mb-4">
                Javobingizni topa olmadingizmi?
              </h3>
              <p className="text-teal-100 mb-6">
                Bizning yordam jamoamiz sizga yordam berishga tayyor
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/contact')}
                  className="bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Bog'lanish
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-teal-600 transition-all duration-300"
                >
                  Jonli Chat
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;