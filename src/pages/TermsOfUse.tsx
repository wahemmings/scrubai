
import React from "react";

const TermsOfUse = () => {
  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="mb-4">Last updated: May 22, 2025</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using ScrubAI's services, website, and applications (collectively, the "Services"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Services.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">2. Description of Service</h2>
        <p>ScrubAI provides tools to remove AI watermarks and provenance data from text, documents, and images. Our Services may include various features accessible through our website and associated applications.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">3. User Registration and Account Security</h2>
        <p>Some features of our Services require registration. You agree to provide accurate information during registration and to maintain the security of your account credentials. You are responsible for all activities that occur under your account.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">4. User Conduct</h2>
        <p>You agree not to use our Services to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on intellectual property rights of others</li>
          <li>Transmit harmful code or attempt to breach our security measures</li>
          <li>Engage in activities that could disrupt or burden our infrastructure</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">5. Content Responsibility</h2>
        <p>You retain ownership of content you upload to our Services. However, by using our Services, you grant ScrubAI a license to host, store, and display your content as necessary to provide the Services.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">6. Subscription and Payment</h2>
        <p>Certain features require a paid subscription. Subscription fees are billed in advance and are non-refundable. You can cancel your subscription at any time, but no refunds will be provided for the current billing period.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">7. Service Limitations and Modifications</h2>
        <p>ScrubAI reserves the right to modify, suspend, or discontinue any part of the Services at any time. We will make reasonable efforts to notify users of significant changes.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">8. Disclaimer of Warranties</h2>
        <p>THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. SCRUBAI DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">9. Limitation of Liability</h2>
        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, SCRUBAI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICES.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">10. Governing Law</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">11. Contact Information</h2>
        <p>For questions about these Terms, please contact us at legal@scrubai.com.</p>
      </div>
    </div>
  );
};

export default TermsOfUse;
