import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy for PAMARA</h1>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
        <p>
          At <strong>PAMARA</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, store, and safeguard your data when you interact with us through our website, social media, or other services. By using our services, you agree to the terms described in this policy.
        </p>

        {/* 1. Information We Collect */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          <p>We collect personal and non-personal information to enhance your shopping experience. This includes:</p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone number, shipping and billing addresses, payment details, and order history.
            </li>
            <li>
              <strong>Non-Personal Information:</strong> IP address, browser type, device information, and browsing behavior on our site.
            </li>
            <li>
              <strong>Social Media & Marketing Data:</strong> If you engage with our social media accounts or sign up for marketing communications, we may collect your preferences and interactions.
            </li>
          </ul>
        </div>

        {/* 2. How We Use Your Information */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6">
            <li>Process and fulfill orders</li>
            <li>Provide customer support</li>
            <li>Improve our website and services</li>
            <li>Send promotional offers, discounts, and updates (only if you opt-in)</li>
            <li>Prevent fraud and enhance security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        {/* 3. How We Share Your Information */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Share Your Information</h2>
          <p>We do not sell or rent your personal data. However, we may share information with:</p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Service Providers:</strong> Payment processors, shipping partners, and marketing platforms that help us run our business.
            </li>
            <li>
              <strong>Legal Authorities:</strong> If required by law or to protect our rights and users.
            </li>
            <li>
              <strong>Business Transfers:</strong> In case of a merger, acquisition, or business sale.
            </li>
          </ul>
        </div>

        {/* 4. Cookies & Tracking Technologies */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies & Tracking Technologies</h2>
          <p>
            <strong>PAMARA</strong> uses cookies and similar tracking technologies to personalize your experience and analyze website traffic. You can manage your cookie preferences through your browser settings.
          </p>
        </div>

        {/* 5. Your Rights & Choices */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights & Choices</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6">
            <li>Access, correct, or delete your personal information</li>
            <li>Opt out of marketing emails at any time</li>
            <li>Request a copy of your data</li>
          </ul>
          <p>To exercise these rights, contact us at <a href="mailto:support@pamara.co.in" className="text-blue-600">support@pamara.co.in</a>.</p>
        </div>

        {/* 6. Data Security */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
          <p>
            We take reasonable security measures to protect your data from unauthorized access, loss, or misuse. However, no online platform is 100% secure, so we encourage you to take precautions with your personal information.
          </p>
        </div>

        {/* 7. Third-Party Links */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for their privacy practices, so please review their policies separately.
          </p>
        </div>

        {/* 8. Updates to This Policy */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date.
          </p>
        </div>

        {/* 9. Contact Us */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, feel free to reach out to us at:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Email:</strong> <a href="mailto:support@pamara.co.in" className="text-blue-600">support@pamara.co.in</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href="tel:+919220726885" className="text-blue-600">+91 9220726885</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
