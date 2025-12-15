import React, { useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Video,
  FileText,
  Headphones,
  Shield,
  DollarSign,
  User,
  Calendar,
  ExternalLink,
  Play,
  Download,
  Star,
  ArrowRight,
} from "lucide-react";

/* ==================== DESIGN SYSTEM ==================== */
const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    gradient: "linear-gradient(135deg, #224e8c 0%, #2a5ca8 100%)",
  },
  success: { 50: "#f0fdf4", 600: "#16a34a" },
  warning: { 50: "#fffbeb", 500: "#f59e0b" },
  danger: { 50: "#fef2f2", 600: "#dc2626" },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

/* ==================== SHIMMER BUTTON ==================== */
const ShimmerButton = ({ onClick, children, className = "", ...props }) => (
  <button
    onClick={onClick}
    className={`
      group relative inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold
      overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200
      ${className}
    `}
    style={{
      backgroundImage: COLORS.primary.gradient,
      boxShadow: "0 10px 30px -10px rgba(34, 78, 140, 0.5)",
    }}
    {...props}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        animation: "shimmer 2s infinite",
      }}
    />
  </button>
);

/* Global shimmer animation */
const style = document.createElement("style");
style.innerHTML = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;
if (!document.head.querySelector("#shimmer-style")) {
  style.id = "shimmer-style";
  document.head.appendChild(style);
}

/* ==================== MAIN COMPONENT ==================== */
export default function CustomerSupport() {
  const [activeTab, setActiveTab] = useState("faq");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "",
    message: "",
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // FAQ Data
  const faqCategories = [
    {
      category: "Getting Started",
      icon: User,
      questions: [
        {
          q: "How do I book an artisan?",
          a: "To book an artisan, go to the search page, select your desired service category, choose an artisan based on ratings and reviews, select a date and time, and confirm your booking. You'll receive instant confirmation once the artisan accepts.",
        },
        {
          q: "How do I create an account?",
          a: "Click on 'Sign Up' on the homepage, enter your email/phone number, verify with OTP, complete your profile with photo and address, and you're ready to start booking!",
        },
        {
          q: "Is my personal information safe?",
          a: "Yes! We use bank-level encryption to protect your data. Your payment information is securely stored and never shared with artisans. We comply with all data protection regulations.",
        },
      ],
    },
    {
      category: "Bookings & Payments",
      icon: Calendar,
      questions: [
        {
          q: "What payment methods are accepted?",
          a: "We accept credit/debit cards (Visa, Mastercard), mobile money (MTN, Airtel, Glo), bank transfers, and wallet balance. All payments are secured through our escrow system.",
        },
        {
          q: "When will I be charged?",
          a: "Payment is held in escrow when you book. Funds are only released to the artisan after you confirm job completion. If the artisan cancels, you get an automatic refund within 24 hours.",
        },
        {
          q: "Can I cancel a booking?",
          a: "Yes! Free cancellation up to 2 hours before scheduled time. Cancellations within 2 hours incur a 20% fee. The artisan keeps the cancellation fee as compensation.",
        },
        {
          q: "How do I get a refund?",
          a: "If the artisan doesn't show up or job isn't completed, go to Booking History, select the booking, click 'Request Refund', and explain the issue. Refunds are processed within 3-5 business days.",
        },
      ],
    },
    {
      category: "Artisans & Services",
      icon: Shield,
      questions: [
        {
          q: "Are artisans verified?",
          a: "Yes! All artisans go through identity verification, background checks, and skill assessments. Look for the 'Verified' badge on profiles for added assurance.",
        },
        {
          q: "How are artisans rated?",
          a: "Customers rate artisans on quality, professionalism, timeliness, and communication after each job. Only verified bookings can leave reviews to prevent fake ratings.",
        },
        {
          q: "What if I'm not satisfied with the work?",
          a: "Contact the artisan first via chat. If unresolved, open a dispute within 48 hours. Our team reviews evidence and may issue partial/full refunds or arrange for rework.",
        },
      ],
    },
    {
      category: "Account & Security",
      icon: DollarSign,
      questions: [
        {
          q: "How do I change my password?",
          a: "Go to Settings > Security > Change Password. Enter your current password, then your new password twice. You'll receive a confirmation email once changed.",
        },
        {
          q: "How do I update my payment methods?",
          a: "Navigate to Payment Methods in your dashboard, click 'Add Payment Method', enter your card/account details, and set it as default if needed.",
        },
        {
          q: "Can I delete my account?",
          a: "Yes, go to Settings > Account > Delete Account. Note: This is permanent and you'll lose all booking history, saved artisans, and wallet balance.",
        },
      ],
    },
  ];

  const supportTickets = [
    {
      id: "#TK-2458",
      subject: "Payment not processed",
      category: "Billing",
      status: "Open",
      priority: "High",
      date: "2 hours ago",
      lastReply: "Support Team",
    },
    {
      id: "#TK-2441",
      subject: "Artisan didn't show up",
      category: "Booking Issue",
      status: "In Progress",
      priority: "High",
      date: "1 day ago",
      lastReply: "You",
    },
    {
      id: "#TK-2423",
      subject: "How to add new address?",
      category: "Account",
      status: "Resolved",
      priority: "Low",
      date: "3 days ago",
      lastReply: "Support Team",
    },
  ];

  const knowledgeBase = [
    {
      title: "Complete Guide to Booking Your First Artisan",
      category: "Getting Started",
      readTime: "5 min read",
      icon: Book,
      popular: true,
    },
    {
      title: "Understanding Our Escrow Payment System",
      category: "Payments",
      readTime: "3 min read",
      icon: DollarSign,
      popular: true,
    },
    {
      title: "How to Resolve Disputes Effectively",
      category: "Support",
      readTime: "4 min read",
      icon: Shield,
      popular: false,
    },
    {
      title: "Safety Tips for Hiring Artisans",
      category: "Safety",
      readTime: "6 min read",
      icon: AlertCircle,
      popular: true,
    },
    {
      title: "Managing Your Payment Methods",
      category: "Account",
      readTime: "2 min read",
      icon: FileText,
      popular: false,
    },
    {
      title: "How Ratings & Reviews Work",
      category: "Artisans",
      readTime: "3 min read",
      icon: Star,
      popular: false,
    },
  ];

  const videoTutorials = [
    {
      title: "How to Book an Artisan in 3 Easy Steps",
      duration: "2:45",
      views: "12.5K",
      thumbnail: "Video",
    },
    {
      title: "Setting Up Your Profile & Payment Methods",
      duration: "4:20",
      views: "8.2K",
      thumbnail: "Credit Card",
    },
    {
      title: "Using Live Chat & Tracking Your Artisan",
      duration: "3:15",
      views: "6.8K",
      thumbnail: "Chat",
    },
    {
      title: "Understanding Our Refund & Dispute Process",
      duration: "5:30",
      views: "5.4K",
      thumbnail: "Refresh",
    },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    alert("Support ticket submitted! We'll respond within 24 hours.");
    setTicketForm({ subject: "", category: "", priority: "", message: "" });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you within 24 hours.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const filteredFaqs = faqCategories.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div
        className="rounded-2xl shadow-lg p-6 lg:p-8 text-white relative overflow-hidden"
        style={{ backgroundImage: COLORS.primary.gradient }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                How can we help you?
              </h1>
              <p className="text-blue-100">
                Get instant answers or reach out to our support team
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <div>
                  <p className="text-xs font-medium">Response Time</p>
                  <p className="text-sm font-bold">&lt; 2 hours</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2">
                <Headphones className="w-4 h-4" />
                <div>
                  <p className="text-xs font-medium">Available</p>
                  <p className="text-sm font-bold">24/7 Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar - WHITE TEXT */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search for help... (e.g., 'How to book', 'Payment issues')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                style={{ caretColor: "white" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Cards - EXACTLY LIKE QUICK ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: MessageSquare,
            label: "Live Chat",
            desc: "Chat with us now",
            action: "Start Chat",
            tab: "chat",
          },
          {
            icon: Mail,
            label: "Email Us",
            desc: "support@artisan.com",
            action: "Send Email",
            tab: "contact",
          },
          {
            icon: Phone,
            label: "Call Us",
            desc: "+234 800 1234 567",
            action: "Call Now",
            tab: null,
          },
          {
            icon: HelpCircle,
            label: "Help Center",
            desc: "Browse FAQs",
            action: "View FAQs",
            tab: "faq",
          },
        ].map((contact, idx) => {
          const Icon = contact.icon;
          return (
            <button
              key={idx}
              onClick={() => contact.tab && setActiveTab(contact.tab)}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 text-center group hover:scale-105 border"
              style={{ borderColor: COLORS.gray[100] }}
            >
              <div
                className="p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform duration-200 mx-auto w-fit"
                style={{ backgroundColor: COLORS.primary[50] }}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: COLORS.primary[600] }}
                />
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: COLORS.gray[900] }}
              >
                {contact.label}
              </p>
              <p className="text-xs mt-1" style={{ color: COLORS.gray[600] }}>
                {contact.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Tabs Navigation */}
      <div
        className="bg-white rounded-2xl shadow-sm border overflow-hidden"
        style={{ borderColor: COLORS.gray[100] }}
      >
        <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max sm:min-w-0">
            {[
              { id: "faq", label: "FAQs", icon: HelpCircle },
              { id: "tickets", label: "My Tickets", icon: FileText },
              { id: "contact", label: "Contact Us", icon: Mail },
              { id: "chat", label: "Live Chat", icon: MessageSquare },
              { id: "knowledge", label: "Knowledge Base", icon: Book },
              { id: "videos", label: "Video Guides", icon: Video },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold text-sm transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* === FAQs Tab === */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              {filteredFaqs.map((category, catIdx) => {
                if (category.questions.length === 0) return null;
                const CategoryIcon = category.icon;
                return (
                  <div key={catIdx}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: COLORS.primary[50] }}
                      >
                        <CategoryIcon
                          className="w-5 h-5"
                          style={{ color: COLORS.primary[600] }}
                        />
                      </div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {category.category}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {category.questions.map((faq, faqIdx) => {
                        const uniqueIndex = `${catIdx}-${faqIdx}`;
                        const isExpanded = expandedFaq === uniqueIndex;
                        return (
                          <div
                            key={faqIdx}
                            className="border rounded-xl overflow-hidden hover:border-blue-300 transition-colors duration-200"
                            style={{ borderColor: COLORS.gray[200] }}
                          >
                            <button
                              onClick={() => toggleFaq(uniqueIndex)}
                              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors duration-200"
                            >
                              <span
                                className="text-base font-semibold pr-4"
                                style={{ color: COLORS.gray[900] }}
                              >
                                {faq.q}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                            </button>
                            {isExpanded && (
                              <div className="px-5 pb-5 pt-0">
                                <p
                                  className="text-sm leading-relaxed"
                                  style={{ color: COLORS.gray[600] }}
                                >
                                  {faq.a}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {filteredFaqs.every((cat) => cat.questions.length === 0) && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-base" style={{ color: COLORS.gray[600] }}>
                    No results found for "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-sm font-semibold hover:underline"
                    style={{ color: COLORS.primary[600] }}
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          )}

          {/* === Tickets Tab === */}
          {activeTab === "tickets" && (
            <div className="space-y-6">
              <div
                className="bg-white rounded-2xl p-6 border"
                style={{ borderColor: COLORS.gray[100] }}
              >
                <h3
                  className="text-lg font-bold mb-4 flex items-center space-x-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  <FileText
                    className="w-5 h-5"
                    style={{ color: COLORS.primary[600] }}
                  />
                  <span>Create New Support Ticket</span>
                </h3>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Brief description of your issue"
                      value={ticketForm.subject}
                      onChange={(e) =>
                        setTicketForm({
                          ...ticketForm,
                          subject: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: COLORS.gray[300] }}
                    />
                    <select
                      required
                      value={ticketForm.category}
                      onChange={(e) =>
                        setTicketForm({
                          ...ticketForm,
                          category: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: COLORS.gray[300] }}
                    >
                      <option value="">Select category</option>
                      <option value="booking">Booking Issue</option>
                      <option value="payment">Payment/Billing</option>
                      <option value="account">Account</option>
                      <option value="technical">Technical Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-3">
                      {["Low", "Medium", "High", "Urgent"].map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() =>
                            setTicketForm({ ...ticketForm, priority })
                          }
                          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                            ticketForm.priority === priority
                              ? priority === "Urgent"
                                ? "bg-red-600 text-white"
                                : priority === "High"
                                ? "bg-orange-600 text-white"
                                : priority === "Medium"
                                ? "bg-yellow-600 text-white"
                                : "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    required
                    placeholder="Describe your issue in detail..."
                    rows={4}
                    value={ticketForm.message}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, message: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    style={{ borderColor: COLORS.gray[300] }}
                  />
                  <ShimmerButton type="submit" className="w-full sm:w-auto">
                    <Send className="w-5 h-5" />
                    <span>Submit Ticket</span>
                  </ShimmerButton>
                </form>
              </div>

              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: COLORS.gray[900] }}
                >
                  Your Support Tickets
                </h3>
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white border-2 rounded-xl p-5 hover:border-blue-300 transition-all cursor-pointer"
                      style={{ borderColor: COLORS.gray[200] }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className="text-xs font-mono"
                              style={{ color: COLORS.gray[500] }}
                            >
                              {ticket.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                ticket.status === "Open"
                                  ? "bg-blue-100 text-blue-700"
                                  : ticket.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {ticket.status}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                ticket.priority === "High" ||
                                ticket.priority === "Urgent"
                                  ? "bg-red-100 text-red-700"
                                  : ticket.priority === "Medium"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {ticket.priority}
                            </span>
                          </div>
                          <h4
                            className="text-base font-bold mb-1 truncate"
                            style={{ color: COLORS.gray[900] }}
                          >
                            {ticket.subject}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: COLORS.gray[600] }}
                          >
                            Category: {ticket.category}
                          </p>
                        </div>
                        <ShimmerButton className="text-xs px-4 py-2">
                          View Details
                        </ShimmerButton>
                      </div>
                      <div
                        className="flex flex-wrap items-center justify-between text-xs pt-3 border-t"
                        style={{
                          borderColor: COLORS.gray[200],
                          color: COLORS.gray[500],
                        }}
                      >
                        <span>Last reply: {ticket.lastReply}</span>
                        <span>{ticket.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === Contact Us Tab === */}
          {activeTab === "contact" && (
            <div className="max-w-2xl mx-auto">
              <div
                className="bg-white rounded-2xl p-6 lg:p-8 border"
                style={{ borderColor: COLORS.gray[100] }}
              >
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Send us a message
                </h3>
                <p className="text-sm mb-6" style={{ color: COLORS.gray[600] }}>
                  We'll get back to you within 24 hours
                </p>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: COLORS.gray[300] }}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderColor: COLORS.gray[300] }}
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: COLORS.gray[300] }}
                  />
                  <textarea
                    required
                    placeholder="Your Message"
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    style={{ borderColor: COLORS.gray[300] }}
                  />
                  <ShimmerButton type="submit" className="w-full">
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </ShimmerButton>
                </form>

                <div
                  className="mt-8 pt-8 border-t"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <h4
                    className="text-base font-bold mb-4"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Other ways to reach us
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: COLORS.gray[900] }}
                        >
                          Phone Support
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: COLORS.gray[600] }}
                        >
                          +234 800 1234 567
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: COLORS.gray[500] }}
                        >
                          Mon-Fri, 8AM-8PM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: COLORS.gray[900] }}
                        >
                          Email Support
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: COLORS.gray[600] }}
                        >
                          support@artisan.com
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: COLORS.gray[500] }}
                        >
                          24/7 Response
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === Live Chat Tab === */}
          {activeTab === "chat" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Headphones className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">
                        Support Team
                      </p>
                      <p className="text-xs text-blue-100">
                        Online - Usually replies in minutes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-900">
                          Hi there! Welcome to Artisan Support. How can we help
                          you today?
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-1">
                        Just now
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 ml-11">
                    {[
                      "Booking Issue",
                      "Payment Problem",
                      "Account Help",
                      "Technical Support",
                    ].map((option, idx) => (
                      <button
                        key={idx}
                        className="px-4 py-2 bg-white border-2 border-blue-200 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 p-4 bg-white">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ShimmerButton className="p-2.5">
                      <Send className="w-5 h-5" />
                    </ShimmerButton>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Tip: Be specific about your issue for faster help
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Clock,
                    title: "Avg Response",
                    value: "< 2 min",
                    color: "text-blue-600",
                  },
                  {
                    icon: CheckCircle,
                    title: "Resolution Rate",
                    value: "98%",
                    color: "text-green-600",
                  },
                  {
                    icon: Star,
                    title: "Satisfaction",
                    value: "4.9/5",
                    color: "text-yellow-600",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-xl p-4 text-center"
                  >
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-2 ${stat.color}`}
                    />
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === Knowledge Base Tab === */}
          {activeTab === "knowledge" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Knowledge Base
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Browse helpful articles and guides
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    "All",
                    "Popular",
                    "Getting Started",
                    "Payments",
                    "Account",
                  ].map((filter, idx) => (
                    <button
                      key={idx}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        idx === 0
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {knowledgeBase.map((article, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <article.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      {article.popular && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Book className="w-4 h-4" />
                        <span>{article.category}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>
                    <ShimmerButton className="mt-4 w-full text-xs py-2">
                      <span>Read Article</span>
                      <ExternalLink className="w-4 h-4" />
                    </ShimmerButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === Video Guides Tab === */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Video Tutorials
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Watch step-by-step guides
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {videoTutorials.map((video, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  >
                    <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 h-48 flex items-center justify-center">
                      <div className="text-6xl">{video.thumbnail}</div>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-blue-600 ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-semibold">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {video.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Video className="w-4 h-4" />
                          <span>{video.views} views</span>
                        </span>
                        <button className="flex items-center space-x-1 text-blue-600 font-semibold hover:underline">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  <span>Complete Video Course</span>
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Master the platform with our comprehensive video series.
                </p>
                <ShimmerButton>
                  <Play className="w-4 h-4" />
                  <span>Watch Full Course (12 videos)</span>
                </ShimmerButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="rounded-2xl shadow-lg p-6 lg:p-8 text-white relative overflow-hidden"
        style={{ backgroundImage: COLORS.primary.gradient }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -mr-24 -mt-24" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full -ml-20 -mb-20" />
        </div>
        <div className="relative z-10 text-center">
          <h3 className="text-xl lg:text-2xl font-bold mb-2">
            Still need help? We're here for you!
          </h3>
          <p className="text-blue-100 mb-6">
            Our support team is available 24/7 to assist you
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ShimmerButton onClick={() => setActiveTab("chat")}>
              <MessageSquare className="w-5 h-5" />
              <span>Start Live Chat</span>
            </ShimmerButton>
            <ShimmerButton
              onClick={() => setActiveTab("contact")}
              className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30"
            >
              <Mail className="w-5 h-5" />
              <span>Send Email</span>
            </ShimmerButton>
          </div>
        </div>
      </div>
    </div>
  );
}
