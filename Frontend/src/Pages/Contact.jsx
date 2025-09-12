import React, { useState } from "react";
import { useTheme } from "../Context/themeContext";
import { toast } from "react-toastify"; // Using react-toastify for notifications
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import emailjs from "emailjs-com";

function ContactUs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    query: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- Validation ---
    if (!formData.name || !formData.email || !formData.query) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    // --- Prepare template data for EmailJS ---
    const templateData = {
      from_name: formData.name,
      to_name: "Ankit Kumar",
      phone: formData.phone,
      message: formData.query,
      from_email: formData.email,
    };

    const serviceID = import.meta.env.VITE_SERVICE_ID;
    const templateID = import.meta.env.VITE_TEMPLATE_ID;
    const userID = import.meta.env.VITE_USER_ID;

    // --- Send Email ---
    emailjs.send(serviceID, templateID, templateData, userID).then(
      (result) => {
        // On Success: Show success toast and clear form
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          query: "",
        });
      },
      (error) => {
        // On Failure: Show error toast
        toast.error("Something went wrong. Please try again later.");
        console.error("EmailJS Error:", error.text);
      }
    );
  };

  return (
    <div
      className={`min-h-screen mb-[-2.5rem] transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p
            className={`text-lg max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, feel free to reach out.
          </p>
        </div>

        {/* Main Content: Two-column layout */}
        <div
          className={`rounded-2xl shadow-2xl overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side: Company Information */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-blue-400 to-indigo-700 text-white">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Our team is available to assist you. You can find us at our
                office, give us a call, or drop us an email.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-8 h-8 mt-1 text-blue-200" />
                  <div>
                    <h3 className="font-semibold text-lg">Our Address</h3>
                    <p className="text-blue-100">
                      Plot No. 1432, Sector 22 'B', Chandigarh, 160022, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-7 h-7 mt-1 text-blue-200" />
                  <div>
                    <h3 className="font-semibold text-lg">Call Us</h3>
                    <p className="text-blue-100">+91 93928 33614</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-7 h-7 mt-1 text-blue-200" />
                  <div>
                    <h3 className="font-semibold text-lg">Email Us</h3>
                    <p className="text-blue-100">ankit330660@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-12 pt-8 border-t border-blue-500">
                <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://x.com/ankit330660"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
                  >
                    <FaXTwitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://github.com/Ankit3060"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ankit-kumar-511b31229/"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
                  >
                    <FaLinkedinIn className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/ankit_ak33/"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.facebook.com/share/1FZxBKzdun/"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
                  >
                    <FaFacebookF className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      isDark
                        ? "bg-gray-700 border-gray-600 placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      isDark
                        ? "bg-gray-700 border-gray-600 placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      isDark
                        ? "bg-gray-700 border-gray-600 placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="+91 12345 67890"
                  />
                </div>

                {/* Query/Message */}
                <div>
                  <label
                    htmlFor="query"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="query"
                    name="query"
                    rows="5"
                    value={formData.query}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none ${
                      isDark
                        ? "bg-gray-700 border-gray-600 placeholder-gray-400"
                        : "bg-gray-50 border-gray-300 placeholder-gray-500"
                    }`}
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;