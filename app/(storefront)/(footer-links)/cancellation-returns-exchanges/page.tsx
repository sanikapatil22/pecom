import React from 'react';

const Policies: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Confirmation Note */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8">PAMARA Return & Exchange Policy</h1>
      {/* Markdown-style note */}
      <div className="p-4 mb-4 border-l-4 border-blue-500 bg-blue-100 text-blue-700">
        <p>
          <strong>Note:</strong> Confirmation for order dispatch and tracking ID will be shared via SMS and email in your registered details.
        </p>
      </div>

      {/* PAMARA Return & Exchange Policy */}
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Returns & Exchanges</h2>
          <ul className="list-disc pl-6">
            <li>
              <strong>Timeframe:</strong> Returns or exchanges are accepted within 7 days from the date of delivery.
            </li>
            <li>
              <strong>Reverse Shipment Fee:</strong> A fee of up to ₹100 per item may be deducted as per our Fair Usage Policy.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Return Pickup & Process</h2>
          <ul className="list-disc pl-6">
            <li>
              <strong>Pickup Timeline:</strong> Return pickups will be attempted within 24–48 hours from the request.
            </li>
            <li>
              <strong>Pickup Attempts:</strong> A maximum of three attempts will be made.
            </li>
            <li>
              <strong>Service Availability:</strong> Reverse pickup is available Pan India through our shipping partner Shiprocket.
            </li>
          </ul>
        </div>
      </div>

      {/* PAMARA Refund Process */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">PAMARA Refund Process</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">For COD Orders</h3>
          <ul className="list-disc pl-6">
            <li>Refunds will be processed to the customer's bank account after the returned product is received at our warehouse.</li>
            <li>Customers must share their bank details for the refund process.</li>
            <li>The refund process will take 7-10 business days after the product reaches our warehouse.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">For Prepaid Orders</h3>
          <ul className="list-disc pl-6">
            <li>Refunds will be credited to your original payment method within 5-7 working days after the returned product reaches our warehouse.</li>
          </ul>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Note:</strong> Reward points, store credits, and shipping charges (if any) are non-refundable.
          </p>
        </div>
      </div>

      {/* Conditions for Returns */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Conditions for Returns</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <ul className="list-disc pl-6">
          <li>Items must be in their original condition with tags intact.</li>
          <li>Products that are used, worn, or returned in poor condition will not be eligible for a refund.</li>
        </ul>
      </div>

      {/* Non-Returnable Items / Exclusions – PAMARA */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Non-Returnable Items / Exclusions – PAMARA</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <p>To maintain hygiene and quality standards, returns are not accepted for the following product categories:</p>
        <ul className="list-disc pl-6">
          <li>Accessories</li>
          <li>Socks</li>
          <li>Innerwear (boxers, briefs, trunks, etc.)</li>
          <li>Headwear (caps, beanies, etc.)</li>
          <li>Customized or personalized products</li>
        </ul>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Note:</strong> PAMARA reserves the right to update the list of non-returnable items without prior notice.
          </p>
        </div>
      </div>

      {/* Self-Shipping for Returns */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Self-Shipping for Returns</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <p>If reverse pickup services are unavailable in your area, you’ll need to ship the product(s) to the following address:</p>
        <div className="bg-gray-100 p-6 rounded-lg">
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>PAMARA WAREHOUSE</strong>
          </p>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Instructions</h3>
        <ul className="list-disc pl-6">
          <li>Pack the items securely to prevent loss or damage during transit.</li>
          <li>Include your Order ID and registered mobile number on the package.</li>
          <li>Ensure all items are in unused condition with tags and packaging intact.</li>
        </ul>
      </div>

      {/* Reimbursement */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reimbursement</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <ul className="list-disc pl-6">
          <li>For prepaid orders, the full amount will be refunded to your bank account.</li>
          <li>For COD orders, the refund will be credited to your bank, for which the details will be provided by you.</li>
        </ul>
      </div>

      {/* Terms and Conditions – PAMARA */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Terms and Conditions – PAMARA</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <ul className="list-disc pl-6">
          <li>Customers must provide accurate bank account details for refunds. PAMARA will not be responsible for any errors in the details provided by the customer.</li>
          <li>If your order is marked as delivered but you haven’t received the package, you must report the issue within 24 hours for investigation.</li>
        </ul>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Note:</strong> PAMARA reserves the right to update these terms and conditions without prior notice.
          </p>
        </div>
      </div>

      {/* Reporting Damages */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reporting Damages</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <ol className="list-decimal pl-6">
          <li>
            If the product does not meet standards at delivery, notify us within 1 day via:
            <ul className="list-disc pl-6 mt-2">
              <li>Instagram DM: <a href="https://instagram.com/pamara.co.in" className="text-blue-600">@pamara.co.in</a></li>
              <li>Cell Phone: <a href="tel:+919220726885" className="text-blue-600">+91 9220726885</a></li>
              <li>Email us at: <a href="mailto:complaints@pamara.co.in" className="text-blue-600">complaints@pamara.co.in</a></li>
            </ul>
          </li>
          <li>Upon receiving the returned product, our team will inspect it and notify you about the refund eligibility. Refunds are processed within 30 working days from confirmation.</li>
        </ol>
      </div>

      {/* Cancellation Policy */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cancellation Policy</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-6">
        <p>Cancellation after dispatch is not available at the moment. You can reject the item during delivery, and the refund will be initiated to your original payment method once the item reaches our warehouse.</p>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-8">Unboxing Video Requirements</h1>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
        {/* Unboxing Video Requirement */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Unboxing Video Requirement</h2>
          <p>
            Customers must record an unboxing video at the time of receiving the package. This video is essential for verifying the condition and contents of the package upon delivery.
          </p>
        </div>

        {/* Empty Package Claims */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Empty Package Claims</h2>
          <p>
            If the package is found to be empty, the customer must provide the unboxing video as proof. Without the unboxing video, PAMARA will not be able to process claims for empty packages.
          </p>
        </div>

        {/* Incorrect Product Claims */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Incorrect Product Claims</h2>
          <p>
            If a different product is received, the customer is required to submit an unboxing video for verification. The video will help us investigate the issue and resolve it promptly.
          </p>
        </div>

        {/* Damaged/Open Packages */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged/Open Packages</h2>
          <p>
            If the package is already opened or damaged before delivery, the customer must not accept the package. Please refuse the delivery and contact our customer support team immediately for further assistance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Policies;
