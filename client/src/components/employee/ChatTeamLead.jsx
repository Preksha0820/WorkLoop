import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import apiService from '../../api/apiService';
import { Send, User, Clock, MoreVertical, Phone, Video, ArrowLeft, Circle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5004", {
  withCredentials: true,
});

const ChatTeamLead = () => {
  const [teamLead, setTeamLead] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch team lead info
  const fetchTeamLead = async () => {
    try {
      setIsLoading(true);
      const res = await apiService.get('/employee/team-lead');
      setTeamLead(res.data.teamLead);
    } catch (err) {
      console.error('Failed to fetch team lead:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch existing chat
  const fetchChatHistory = async (leadId) => {
    try {
      console.log('Fetching chat history for lead:', leadId);
      const res = await apiService.get(`/chat/${leadId}`);
      console.log('Chat history response:', res.data);
      // The API returns messages directly, not wrapped in a messages object
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
      setMessages([]); // Set empty array on error
    }
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Format time
  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { 
      return messageDate.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !teamLead.id) return;

    const payload = {
      senderId: user.id,
      receiverId: teamLead.id,
      content: newMessage,
    };
    
    socket.emit('send-message', payload);
    setMessages((prev) => [...prev, { ...payload, createdAt: new Date() }]);
    setNewMessage('');
    
    // Scroll to bottom after sending message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket.emit('typing', { receiverId: teamLead.id });
  };

  // Real-time receive
  useEffect(() => {
    socket.on('receive-message', (message) => {
      if (message.senderId === teamLead.id || message.receiverId === teamLead.id) {
        setMessages((prev) => [...prev, message]);
        
        // Scroll to bottom when receiving a message
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

    return () => {
      socket.off('receive-message');
    };
  }, [teamLead]);

  // Initial load
  useEffect(() => {
    fetchTeamLead();
  }, []);
   
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
  }, []);

  useEffect(() => {
    if (teamLead) {
      console.log('Team lead found, fetching chat history:', teamLead);
      fetchChatHistory(teamLead.id);
      socket.emit('joinRoom', { role: user.role, userId: user.id });
    }
  }, [teamLead, user.role, user.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleDeleteChatHistory = async () => {
    if (!teamLead?.id) return;
    if (!window.confirm('Are you sure you want to delete the chat history? This cannot be undone.')) return;
    try {
      await apiService.delete(`/chat/${teamLead.id}`);
      setMessages([]);
      setMenuOpen(false);
      alert('Chat history deleted successfully.');
    } catch (err) {
      alert('Failed to delete chat history.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-6 mb-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-[600px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    
    <div className="max-w-6xl mx-auto mt-6 mb-6 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm relative">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {teamLead?.name || 'Team Lead'}
                </h1>
                <p className="text-sm text-green-600 flex items-center">
                  <Circle className="w-2 h-2 mr-1 fill-current" />
                  Online
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 relative">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={handleDeleteChatHistory}
                  >
                    Delete Chat History
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
            <p className="text-gray-600 max-w-sm">
              Send a message to your team lead to get started with your conversation.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isCurrentUser = msg.senderId === user.id;
            const showTime = i === 0 || 
              new Date(messages[i].createdAt).getTime() - new Date(messages[i-1].createdAt).getTime() > 300000; // 5 minutes

            return (
              <div key={i} className="space-y-2">
                {showTime && (
                  <div className="flex justify-center">
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                    {!isCurrentUser && (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`px-4 py-2 rounded-2xl ${
                      isCurrentUser 
                        ? 'bg-blue-600 text-white rounded-br-md' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 min-h-[44px]"
              rows="1"
              style={{ 
                height: 'auto',
                minHeight: '44px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              newMessage.trim() 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
  );}
  
export default ChatTeamLead;