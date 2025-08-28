import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Send, Paperclip, Smile, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { Conversation, Message } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { useTheme } from '../contexts/ThemeContext';
import { formatTime } from "../utils/format";

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Sahifa yuklanganda yuqoriga scroll qilish
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tizimga kirish talab etiladi
          </h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  // Hozircha xabarlar uchun API yo'q, shuning uchun bo'sh array
  const conversations: Conversation[] = [];

  // Mock messages for selected conversation
  const getMessagesForConversation = (conversationId: string): Message[] => {
    const baseMessages: Record<string, Message[]> = {
      '1': [
        {
          id: 'msg1-1',
          senderId: user?.id?.toString() || 'current-user',
          senderName: user?.first_name || user?.username || 'Siz',
          content: 'Assalomu alaykum! Kvartira haqida ma\'lumot olsam bo\'ladimi?',
          timestamp: '2024-01-15T13:00:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg1-2',
          senderId: 'landlord1',
          senderName: 'Aziz Karimov',
          content: 'Wa alaykum assalom! Albatta, qanday ma\'lumot kerak?',
          timestamp: '2024-01-15T13:15:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg1-3',
          senderId: user?.id?.toString() || 'current-user',
          senderName: user?.first_name || user?.username || 'Siz',
          content: 'Kvartira qachondan boshlab bo\'sh? Va oylik ijara narxi qancha?',
          timestamp: '2024-01-15T13:30:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg1-4',
          senderId: 'landlord1',
          senderName: 'Aziz Karimov',
          content: 'Kvartira hoziroq bo\'sh. Oylik ijara 2,500,000 so\'m. Kommunal to\'lovlar alohida.',
          timestamp: '2024-01-15T14:00:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg1-5',
          senderId: 'landlord1',
          senderName: 'Aziz Karimov',
          content: 'Kvartira haqida qo\'shimcha savollaringiz bormi?',
          timestamp: '2024-01-15T14:30:00Z',
          read: false,
          type: 'text'
        }
      ],
      '2': [
        {
          id: 'msg2-1',
          senderId: user?.id?.toString() || 'current-user',
          senderName: user?.first_name || user?.username || 'Siz',
          content: 'Yotoqxonaga ariza yubordim. Holati qanday?',
          timestamp: '2024-01-15T09:00:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg2-2',
          senderId: 'admin1',
          senderName: 'TATU Admin',
          content: 'Arizangiz qabul qilindi. Hujjatlaringiz tekshirilmoqda.',
          timestamp: '2024-01-15T09:30:00Z',
          read: true,
          type: 'text'
        },
        {
          id: 'msg2-3',
          senderId: 'admin1',
          senderName: 'TATU Admin',
          content: 'Arizangiz ko\'rib chiqilmoqda. Tez orada javob beramiz.',
          timestamp: '2024-01-15T10:15:00Z',
          read: true,
          type: 'text'
        }
      ]
    };
    return baseMessages[conversationId] || [];
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const messages = selectedConversation ? getMessagesForConversation(selectedConversation) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`${selectedConversation ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Xabarlar
                </h1>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Xabarlarni qidiring..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-white' 
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Hali xabarlar yo'q
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Uy egasi yoki yotoqxona ma'muriyati bilan bog'laning
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {conversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 cursor-pointer transition-colors duration-200 ${
                          selectedConversation === conversation.id 
                            ? 'bg-teal-50 dark:bg-teal-900/20 border-r-2 border-teal-600' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {conversation.participantName.charAt(0)}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {conversation.unreadCount}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`font-medium truncate ${
                                conversation.unreadCount > 0 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {conversation.participantName}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            {conversation.listingTitle && (
                              <p className="text-xs text-teal-600 dark:text-teal-400 mb-1">
                                {conversation.listingTitle}
                              </p>
                            )}
                            
                            <p className={`text-sm truncate ${
                              conversation.unreadCount > 0 
                                ? 'text-gray-900 dark:text-white font-medium' 
                                : 'text-gray-600 dark:text-gray-300'
                            }`}>
                              {conversation.lastMessage.senderId === (user?.id?.toString() || 'current-user') ? 'Siz: ' : ''}
                              {conversation.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`${selectedConversation ? 'block' : 'hidden lg:block'} flex-1 flex flex-col`}>
              {selectedConversation && selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedConversation(null)}
                          className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </motion.button>
                        
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedConv.participantName.charAt(0)}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {selectedConv.participantName}
                          </h3>
                          {selectedConv.listingTitle && (
                            <p className="text-sm text-teal-600 dark:text-teal-400">
                              {selectedConv.listingTitle}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                        >
                          <Phone className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                        >
                          <Video className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex ${message.senderId === (user?.id?.toString() || 'current-user') ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.senderId === (user?.id?.toString() || 'current-user')
                            ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white'
                            : theme === 'dark' 
                              ? 'bg-gray-700 text-white' 
                              : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === (user?.id?.toString() || 'current-user') 
                              ? 'text-teal-100' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                      >
                        <Paperclip className="w-5 h-5" />
                      </motion.button>
                      
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Xabar yozing..."
                          className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
                            theme === 'dark' 
                              ? 'border-gray-600 bg-gray-700 text-white' 
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200"
                        >
                          <Smile className="w-5 h-5" />
                        </motion.button>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="p-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Suhbatni tanlang
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Xabar yuborish uchun chap tarafdan suhbatni tanlang
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;