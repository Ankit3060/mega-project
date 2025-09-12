import React from "react";
import { useTheme } from "../Context/themeContext";
import { NavLink } from "react-router-dom";

function TermsAndConditions() {
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
              Terms and Conditions
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
              Please read these Terms and Conditions ("Terms", "Terms and
              Conditions") carefully before using the AK Blog platform (the
              "Service") operated by AK Blog ("us", "we", or "our").
            </p>
            <p>
              Your access to and use of the Service is conditioned upon your
              acceptance of and compliance with these Terms. These Terms apply
              to all visitors, users, and others who wish to access or use the
              Service. By accessing or using the Service, you agree to be bound
              by these Terms.
            </p>

            <h2 id="accounts">1. Accounts</h2>
            <p>
              When you create an account with us, you guarantee that you are
              above the age of 13, and that the information you provide us is
              accurate, complete, and current at all times. You are responsible
              for safeguarding the password that you use to access the Service
              and for any activities or actions under your password.
            </p>

            <h2 id="user-content">2. User-Generated Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise
              make available certain information, text, graphics, videos, or
              other material ("Content"). You are responsible for the Content
              that you post on or through the Service, including its legality,
              reliability, and appropriateness.
            </p>
            <p>
              By posting Content, you grant us a worldwide, non-exclusive,
              royalty-free, sublicensable license to use, modify, publicly
              perform, publicly display, reproduce, and distribute such Content
              on and through the Service. You retain any and all of your rights
              to any Content you submit.
            </p>

            <h2 id="prohibited-activities">3. Prohibited Activities</h2>
            <p>
              You agree not to use the Service for any purpose that is illegal
              or prohibited by these Terms. You agree not to:
            </p>
            <ul>
              <li>
                Harass, abuse, or harm another person or group.
              </li>
              <li>
                Post any content that is fraudulent, defamatory, obscene, or
                otherwise objectionable.
              </li>
              <li>
                Use the Service to transmit spam, chain letters, or other
                unsolicited communications.
              </li>
              <li>
                Infringe upon the intellectual property rights of others,
                including copyright, trademark, or patent.
              </li>
              <li>
                Upload or transmit viruses, Trojan horses, or other malicious
                code.
              </li>
            </ul>

            <h2 id="intellectual-property">4. Intellectual Property</h2>
            <p>
              The Service and its original content (excluding Content provided
              by users), features, and functionality are and will remain the
              exclusive property of AK Blog and its licensors. The Service is
              protected by copyright, trademark, and other laws of both India
              and foreign countries.
            </p>

            <h2 id="termination">5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including,
              without limitation, if you breach the Terms. Upon termination,
              your right to use the Service will immediately cease.
            </p>

            <h2 id="disclaimer">6. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
              The Service is provided without warranties of any kind, whether
              express or implied, including, but not limited to, implied
              warranties of merchantability, fitness for a particular purpose,
              or non-infringement.
            </p>
            
            <h2 id="liability">7. Limitation of Liability</h2>
            <p>
              In no event shall AK Blog, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect,
              incidental, special, consequential, or punitive damages arising
              out of your use of the Service.
            </p>

            <h2 id="governing-law">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with
              the laws of India, with exclusive jurisdiction in the courts of
              <strong>Chandigarh</strong>, without regard to its conflict of law
              provisions.
            </p>

            <h2 id="changes">9. Changes to These Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or
              replace these Terms at any time. If a revision is material, we
              will provide at least 30 days' notice prior to any new terms
              taking effect. What constitutes a material change will be
              determined at our sole discretion.
            </p>

            <h2 id="contact-us">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us
              through our{" "}
              <NavLink
                to="/contact"
                className={`font-semibold transition ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Contact Page
              </NavLink>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;