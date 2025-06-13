import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Users, Clock, MessageSquare, MapPin, Calendar, Bell, Zap, RotateCcw, Mic, Globe } from 'lucide-react';

const features = [
  { icon: CheckCircle, title: "Task Management", description: "Organize and track tasks efficiently with smart prioritization" },
  { icon: Users, title: "Attendance", description: "Real-time attendance tracking with automated reports" },
  { icon: Zap, title: "Dashboard", description: "Comprehensive analytics and insights at your fingertips" },
  { icon: Bell, title: "Notification", description: "Smart notifications to keep everyone in sync" },
  { icon: Zap, title: "Ease of Integration", description: "Seamlessly integrate with your existing tools" },
  { icon: Clock, title: "Time Sheets", description: "Accurate time tracking with detailed reporting" },
  { icon: Calendar, title: "Calendar", description: "Unified calendar view for all your events and deadlines" },
  { icon: MessageSquare, title: "Instant Message", description: "Real-time communication with team members" },
  { icon: MapPin, title: "Geolocation", description: "Location-based attendance and task management" },
  { icon: Mic, title: "Voice Message", description: "Quick voice messages for faster communication" },
  { icon: Globe, title: "Vernacular Languages", description: "Multi-language support for global teams" },
  { icon: RotateCcw, title: "Recurring Tasks", description: "Automate repetitive tasks with smart scheduling" },
];

const faqs = [
  {
    question: "How does the attendance tracking work?",
    answer: "Our attendance system uses advanced geolocation and biometric verification to ensure accurate tracking. Employees can check in/out using their mobile devices, and managers get real-time updates with detailed reports."
  },
  {
    question: "Can I integrate this with my existing tools?",
    answer: "Absolutely! Our platform supports integration with popular tools like Slack, Microsoft Teams, Google Workspace, Jira, and many more. We also provide REST APIs for custom integrations."
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. We use enterprise-grade encryption, regular security audits, and comply with GDPR, SOC 2, and other industry standards to keep your data safe."
  },
  {
    question: "Do you offer mobile apps?",
    answer: "Yes! We have native mobile apps for both iOS and Android, offering full functionality including offline mode, push notifications, and biometric authentication."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We offer 24/7 customer support through chat, email, and phone. Premium plans include dedicated account managers and priority support with guaranteed response times."
  },
  {
    question: "Can I customize the dashboard?",
    answer: "Definitely! Our dashboard is fully customizable. You can create custom widgets, set up personalized views, and configure automated reports based on your specific needs."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "HR Manager",
    company: "TechCorp Inc.",
    content: "This platform transformed how we manage our remote team. Attendance tracking is seamless and the productivity insights are invaluable.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Project Manager",
    company: "Digital Solutions",
    content: "The task management features are incredible. We've seen a 40% increase in project completion rates since implementing this system.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Operations Director",
    company: "Global Enterprises",
    content: "Multi-language support was a game-changer for our international team. Everyone can now use the platform in their preferred language.",
    rating: 5
  }
];

export default function EnhancedFeaturesUI() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> boost productivity</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your workflow with our comprehensive suite of tools designed for modern teams
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Loved by Teams
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What our customers say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have transformed their productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MessageSquare className="w-4 h-4" />
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openFAQ === index && (
                  <div className="px-8 pb-6">
                    <div className="h-px bg-gray-200 mb-4"></div>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}