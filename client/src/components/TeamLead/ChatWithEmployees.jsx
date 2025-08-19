import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import apiService from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';
import { Send, User, Clock, MoreVertical, Phone, Video, ArrowLeft, Circle, Users } from 'lucide-react';

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5004", {
  withCredentials: true,
});

const ChatWithEmployees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default width
  const [isResizing, setIsResizing] = useState(false);

  // Fetch employees under the team lead
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const res = await apiService.get('/teamLead/employees');
      setEmployees(res.data.employees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch chat with a selected employee
  const fetchChat = async (employeeId) => {
    try {
      console.log('Fetching chat for employee:', employeeId);
      const res = await apiService.get(`/chat/${employeeId}`);
      console.log('Chat API response:', res.data);
      // The API returns messages directly, not wrapped in a messages object
      setMessagesMap((prev) => ({
        ...prev,
        [employeeId]: res.data || [],
      }));
    } catch (err) {
      console.error('Failed to fetch chat:', err);
      setMessagesMap((prev) => ({
        ...prev,
        [employeeId]: [],
      }));
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format time
  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return messageDate.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  // Join socket room on mount
  useEffect(() => {
    if (user && user.id) {
      socket.emit('joinRoom', { role: user.role, userId: user.id });
      // console.log('Team Lead joined room:', `${user.role === 'TEAM_LEAD' ? 'teamLead' : user.role.toLowerCase()}_${user.id}`);
      fetchEmployees();
    }
  }, [user]);

  // Socket connection status
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // Receive message in real-time
  useEffect(() => {
    socket.on('receive-message', (message) => {
      
      // Check if this message is for the current user (either as sender or receiver)
      if (message.senderId === user.id || message.receiverId === user.id) {
        const partnerId = message.senderId === user.id ? message.receiverId : message.senderId;
        
        setMessagesMap((prev) => ({
          ...prev,
          [partnerId]: [...(prev[partnerId] || []), message],
        }));
    
        // Auto scroll if the current conversation is active
        if (selectedEmployee?.id === partnerId) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    });
  
    return () => socket.off('receive-message');
  }, [user.id, selectedEmployee]);

  // Handle sending message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedEmployee) return;

    const payload = {
      senderId: user.id,
      receiverId: selectedEmployee.id,
      content: newMessage,
    };

    socket.emit('send-message', payload);

    setMessagesMap((prev) => ({
      ...prev,
      [selectedEmployee.id]: [
        ...(prev[selectedEmployee.id] || []),
        { ...payload, createdAt: new Date() },
      ],
    }));

    setNewMessage('');
  };

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (selectedEmployee) {
      socket.emit('typing', { receiverId: selectedEmployee.id });
    }
  };

  // Select employee to chat
  const handleSelect = (emp) => {
    setSelectedEmployee(emp);
    if (!messagesMap[emp.id]) {
      fetchChat(emp.id);
    }
  };

  // Handle resize
  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 600) {
          setSidebarWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(scrollToBottom, [selectedEmployee, messagesMap]);

  const currentMessages = selectedEmployee ? messagesMap[selectedEmployee.id] || [] : [];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto mt-6 mb-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center h-[600px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-6 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex h-[600px]">
        {/* Employee List Sidebar */}
        <div style={{ width: `${sidebarWidth}px` }}
          className="bg-white border-r-2 border-gray-500 flex flex-col">
          {/* Sidebar Header */}
          <div className="bg-white border-b border-gray-400 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Your Employees</h2>
            </div>
            <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
              {employees.length}
            </span>
          </div>

          {/* Employee List */}
          <div className="flex-1 overflow-y-auto">
            {employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                <p className="text-gray-600 max-w-sm">
                  Employees assigned to you will appear here.
                </p>
              </div>
            ) : (
              <div className="p-2">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => handleSelect(emp)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedEmployee?.id === emp.id 
                        ? 'bg-blue-100 border-2 border-gray-400' 
                        : 'hover:bg-gray-200'}`}>
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {emp.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 bg-gray-200 cursor-col-resize hover:bg-blue-400 transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {selectedEmployee ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-400 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4">
                  <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
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
                        {selectedEmployee.name}
                      </h1>
                      <p className="text-sm text-green-600 flex items-center">
                        <Circle className="w-2 h-2 mr-1 fill-current" />
                        Online
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div> */}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
                {currentMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                    <p className="text-gray-600 max-w-sm">
                      Send a message to {selectedEmployee.name} to get started with your conversation.
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg, i) => {
                    const isCurrentUser = msg.senderId === user.id;
                    const showTime = i === 0 || 
                      new Date(currentMessages[i].createdAt).getTime() - new Date(currentMessages[i-1].createdAt).getTime() > 300000; // 5 minutes

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
                      className="w-full resize-none rounded-2xl border border-gray-500 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 min-h-[44px]"
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
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an employee</h3>
                <p className="text-gray-600">
                  Choose an employee from the list to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWithEmployees;
