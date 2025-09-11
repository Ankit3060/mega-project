import React from 'react';
import { BiArrowBack, BiHeart, BiShare, BiComment, BiBookmark } from 'react-icons/bi';
import { SlHeart } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';

function AboutUs() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      bio: "Passionate about connecting writers with readers worldwide."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Building the future of digital publishing, one line of code at a time."
    },
    {
      name: "Emma Rodriguez",
      role: "Head of Content",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Curating amazing stories and fostering our writing community."
    },
    {
      name: "David Kim",
      role: "Product Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Creating beautiful, intuitive experiences for writers and readers."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Writers" },
    { number: "50K+", label: "Published Stories" },
    { number: "100K+", label: "Daily Readers" },
    { number: "25+", label: "Countries" }
  ];

  const values = [
    {
      icon: "📝",
      title: "Creative Expression",
      description: "We believe everyone has a story worth telling. Our platform empowers writers to share their unique voices with the world."
    },
    {
      icon: "🌍",
      title: "Global Community",
      description: "Connecting writers and readers across cultures, languages, and backgrounds to create a truly diverse literary ecosystem."
    },
    {
      icon: "🔧",
      title: "Innovation",
      description: "Constantly evolving our platform with cutting-edge features that enhance the writing and reading experience."
    },
    {
      icon: "🤝",
      title: "Authenticity",
      description: "Fostering genuine connections through honest storytelling and meaningful engagement between creators and audiences."
    }
  ];

  const handleNavigation = (path) => {
    // Replace with your actual navigation logic
    console.log(`Navigate to: ${path}`);
    // navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-blue-900 transition-colors"
          >
            <BiArrowBack className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">AK Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're building the future of digital storytelling, where every voice matters 
            and every story finds its audience. Join our community of passionate writers 
            and curious readers from around the globe.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                AK Blog was born from a simple belief: everyone has a story worth sharing. 
                We've created a platform where writers can express themselves freely, connect 
                with like-minded individuals, and build meaningful relationships through the 
                power of storytelling.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Whether you're a seasoned author, an aspiring blogger, or someone who just 
                loves to read, our community welcomes you with open arms. Together, we're 
                building a more connected and creative world, one story at a time.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-3">Why We Started</h3>
                <p className="text-blue-100">
                  In a world full of noise, we wanted to create a space for meaningful 
                  conversations and authentic storytelling that brings people together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Makes Us Special</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BiComment className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Community</h3>
                  <p className="text-gray-600">Engage with writers through comments, likes, and meaningful discussions.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <SlHeart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Follow Your Favorites</h3>
                  <p className="text-gray-600">Never miss a post from your favorite writers with our follow system.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BiShare className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Sharing</h3>
                  <p className="text-gray-600">Share amazing stories with your network across all social platforms.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <BiBookmark className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Save for Later</h3>
                  <p className="text-gray-600">Bookmark stories to read later and build your personal library.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Join Our Growing Community</h3>
              <p className="text-blue-100 mb-6">
                Start your writing journey today or discover your next favorite read. 
                Our platform is designed to inspire, connect, and celebrate the art of storytelling.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Share Your Story?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who have already made AK Blog their home for creative expression.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/user/create/blog')}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Start Writing
            </button>
            <button
              onClick={() =>navigate('/explore')}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors cursor-pointer"
            >
              Explore Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;