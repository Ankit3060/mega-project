import React from "react";
import { useTheme } from "../Context/themeContext";
import { NavLink } from "react-router-dom";

function PrivacyPolicy() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen mb-[-2.5rem] transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div
          className={`rounded-2xl shadow-2xl p-8 lg:p-12 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="text-center mb-10">
            <h1
              className={`text-4xl md:text-5xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Privacy Policy
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Last Updated: September 12, 2025
            </p>
          </div>

          <div
            className={`prose prose-lg max-w-none ${
              isDark ? "prose-invert" : ""
            }`}
          >
            <p>
              Welcome to AK Blog ("we," "us," or "our"). We are committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our platform. Please read this policy carefully. If you do not
              agree with the terms of this privacy policy, please do not access
              the site.
            </p>

            <h2 id="information-collection">1. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The
              information we may collect on the Site includes:
            </p>
            <ul>
              <li>
                <strong>Personal Data:</strong> Personally identifiable
                information, such as your name, username, email address, and
                password, that you voluntarily give to us when you register
                with the Site or when you choose to participate in various
                activities related to the Site, such as creating a blog, posting
                comments, and liking posts.
              </li>
              <li>
                <strong>Profile and User Content:</strong> Information you provide for
                your user profile (e.g., bio, profile picture) and the content
                you post to the Service (e.g., photos, comments, and other
                materials).
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers
                automatically collect when you access the Site, such as your IP
                address, your browser type, your operating system, your access
                times, and the pages you have viewed directly before and after
                accessing the Site.
              </li>
            </ul>

            <h2 id="use-of-information">2. How We Use Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you via the Site to:
            </p>
            <ul>
              <li>Create and manage your account.</li>
              <li>
                Personalize your experience and display content relevant to your
                interests.
              </li>
              <li>
                Communicate with you about your account or our services.
              </li>
              <li>Monitor and analyze usage and trends to improve the Site.</li>
              <li>
                Prevent fraudulent transactions, monitor against theft, and
                protect against criminal activity.
              </li>
            </ul>

            <h2 id="sharing-information">3. How We Share Your Information</h2>
            <p>
              We do not share your personal information with third parties
              except as described in this Privacy Policy. We may share
              information we have collected about you in certain situations:
            </p>
            <ul>
              <li>
                <strong>Publicly Visible Information:</strong> Your username,
                profile picture, and any content you post (blogs, comments) are
                visible to the public.
              </li>
              <li>
                <strong>By Law or to Protect Rights:</strong> If we believe the
                release of information about you is necessary to respond to
                legal process, to investigate or remedy potential violations of
                our policies, or to protect the rights, property, and safety of
                others.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> We may share your
                information with third parties that perform services for us or
                on our behalf, including data analysis, hosting services, and
                customer service.
              </li>
            </ul>

            <h2 id="your-choices">4. Your Choices and Rights</h2>
            <p>
              You have certain rights regarding the personal information we hold
              about you.
            </p>
            <ul>
              <li>
                <strong>Account Information:</strong> You may at any time review
                or change the information in your account or terminate your
                account by logging into your account settings and updating your
                account.
              </li>
              <li>
                <strong>Access and Deletion:</strong> You can access and modify
                your profile data directly from your profile settings. You can
                also delete your content (blogs, comments) at any time.
                Terminating your account will result in the deletion of your
                profile and associated personal information from our active
                databases.
              </li>
            </ul>

            <h2 id="data-security">5. Data Security</h2>
            <p>
              We use administrative, technical, and physical security measures
              to help protect your personal information. While we have taken
              reasonable steps to secure the personal information you provide to
              us, please be aware that despite our efforts, no security measures
              are perfect or impenetrable, and no method of data transmission

              can be guaranteed against any interception or other type of
              misuse.
            </p>
            
            <h2 id="childrens-privacy">6. Children's Privacy</h2>
            <p>
              Our services are not intended for use by children under the age of
              13. We do not knowingly collect personal information from
              children under 13. If we learn that we have collected personal
              information from a child under 13, we will take steps to delete
              the information as soon as possible.
            </p>

            <h2 id="policy-changes">7. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time in order to
              reflect, for example, changes to our practices or for other
              operational, legal, or regulatory reasons. We will notify you of
              any changes by posting the new Privacy Policy on this page and
              updating the "Last Updated" date.
            </p>

            <h2 id="contact-us">8. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy,
              please contact us through our{" "}
              <NavLink
                to="/contact"
                className={`font-semibold transition ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Contact Page
              </NavLink>{" "}
              or email us directly at:
            </p>
            <p>
              <a
                href="mailto:support@akblog.com"
                className={`font-semibold transition ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                ankit330660@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;