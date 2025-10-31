import React, { useState } from "react";
import { useTheme } from "../Context/themeContext";
import { NavLink } from "react-router-dom";
import { ChevronDown, Mail } from "lucide-react";

// FAQ data organized by category
const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: 'To create an account, click the "Signup" button on the top right of the homepage. You will be asked to provide a full name, a unique username, a valid email address, and a secure password.',
      },
      {
        q: "How can I update my profile?",
        a: 'Once logged in, click on your avatar in the header to open the user menu, then select "Update Profile." From there, you can change your full name, username, bio, and upload a new profile picture.',
      },
      {
        q: "How do I change my password?",
        a: 'You can change your password from the "Update Profile" page. You will find a "Change Password" section where you will need to enter your current password and a new password.',
      },
    ],
  },
  {
    category: "Writing & Publishing",
    questions: [
      {
        q: "How do I write and publish a new blog post?",
        a: 'Click the "Write" button in the header. This will take you to the blog editor. Simply add a title, write your content, optionally upload a cover image, and click "Publish" to share your story with the community.',
      },
      {
        q: "Can I edit or delete my posts after publishing?",
        a: "Yes. When viewing one of your own blog posts, you will see an options menu (three dots) near the top. From there, you can choose to either edit the post, which will take you back to the editor, or delete it permanently.",
      },
    ],
  },
  {
    category: "Community & Interaction",
    questions: [
      {
        q: "How can I follow other users?",
        a: "When you are viewing another user's profile or one of their blog posts, you will see a 'Follow' button. Clicking this button will subscribe you to their future posts, which will appear in your feed.",
      },
      {
        q: "How do I comment on or like a post?",
        a: "At the bottom of every blog post, you will find action buttons to 'Like' and 'Comment'. Clicking the heart icon will like the post, and the comment button will open a text box for you to share your thoughts.",
      },
      {
        q: "How can I report inappropriate content?",
        a: "If you come across a post or comment that violates our community guidelines, please use the options menu (three dots) next to the content to find the 'Report' option. Our moderation team will review all reports.",
      },
    ],
  },
];

// Reusable FAQ Item component for the accordion
function FaqItem({ item, isOpen, onToggle }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`border rounded-lg transition-all duration-300 ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left p-4 sm:p-5"
      >
        <span
          className={`font-semibold text-base sm:text-lg ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {item.q}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          } ${isDark ? "text-gray-400" : "text-gray-500"}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div
          className={`p-4 sm:p-5 border-t text-sm sm:text-base leading-relaxed ${
            isDark
              ? "border-gray-700 text-gray-300 bg-gray-800/50"
              : "border-gray-200 text-gray-700 bg-gray-50"
          }`}
        >
          {item.a}
        </div>
      </div>
    </div>
  );
}

function HelpCenter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [openFaq, setOpenFaq] = useState(null);

  const handleToggle = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div
      className={`min-h-screen mb-[-2.5rem] transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p
            className={`text-lg max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Have questions? We're here to help. Find answers to common
            questions about using Quick Blog.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqData.map((section, sectionIndex) => (
            <div key={section.category}>
              <h2
                className={`text-2xl font-bold mb-6 pb-2 border-b ${
                  isDark
                    ? "text-white border-gray-700"
                    : "text-gray-900 border-gray-200"
                }`}
              >
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.questions.map((item, itemIndex) => {
                  const uniqueIndex = `${sectionIndex}-${itemIndex}`;
                  return (
                    <FaqItem
                      key={uniqueIndex}
                      item={item}
                      isOpen={openFaq === uniqueIndex}
                      onToggle={() => handleToggle(uniqueIndex)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Us CTA */}
        <div
          className={`mt-16 text-center p-8 rounded-2xl ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <h3
            className={`text-2xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Still Need Help?
          </h3>
          <p
            className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            If you can't find the answer you're looking for, please don't
            hesitate to reach out to our support team.
          </p>
          <NavLink
            to="/contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300"
          >
            <Mail className="w-5 h-5" />
            Contact Us
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;