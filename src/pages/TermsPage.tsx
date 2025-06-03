import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600">
              By accessing or using how2AI's website and services, you agree to be bound by these Terms of Service.
              If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily access and use our services for personal, non-commercial use,
              subject to the following restrictions:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>You must not modify or copy our materials</li>
              <li>You must not use the materials for commercial purposes</li>
              <li>You must not attempt to decompile or reverse engineer any software</li>
              <li>You must not remove any copyright or proprietary notations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">When creating an account, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update your account information</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Service Modifications</h2>
            <p className="text-gray-600">
              We reserve the right to modify, suspend, or discontinue our services at any time without notice.
              We shall not be liable to you or any third party for any modification, suspension, or discontinuance
              of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Content</h2>
            <p className="text-gray-600 mb-4">
              By submitting content to our platform, you grant us a worldwide, non-exclusive, royalty-free license
              to use, reproduce, and distribute your content. You represent that you have all necessary rights to
              grant this license.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600">
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use or inability to use our services. This includes but is not limited to loss
              of data, profits, or business opportunities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Governing Law</h2>
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of the United States,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of any material changes
              by posting the new Terms on this page. Your continued use of the service constitutes acceptance of
              the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-600">
              For questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 text-gray-600">
              <p>Email: support@how2doai.com</p>
              <p>Address: Lucknow, Uttar Pradesh, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;