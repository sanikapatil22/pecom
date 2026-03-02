import React from 'react';

const FAQs: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions (FAQs)</h1>

      {/* Return and Exchange Policy Questions */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Return and Exchange Policy Questions</h1>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <div>
          <p className="font-semibold text-gray-900">Q: What is your return policy?</p>
          <p>A: We accept returns on unworn, unwashed, and undamaged items within 30 days of purchase. All items must be in their original packaging with tags attached.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Q: How do I initiate a return or exchange?</p>
          <p>A: To start a return or exchange, please contact our customer service team with your order details. They will guide you through the process and provide a return shipping label if applicable.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Q: Are there any items that cannot be returned or exchanged?</p>
          <p>A: Yes, certain items such as undergarments, final sale products, or customized orders are non-returnable due to hygiene or promotional terms. Please review our complete policy for details.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Q: Who covers the return shipping cost?</p>
          <p>A: If the return is due to an error on our part (e.g., wrong or defective item), we’ll cover the shipping cost. For other reasons, return shipping costs are the responsibility of the customer.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Q: When will I receive my refund or exchange item?</p>
          <p>A: Refunds are processed within 7–10 business days after we receive the returned item. For exchanges, the replacement product will be shipped once the original item is received and inspected.</p>
        </div>
      </div>

      {/* General Questions */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">General Questions</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-12">
        <div>
          <p className="font-semibold text-gray-900">1. Is Cash on Delivery (COD) available?</p>
          <p>A: Yes, we offer Cash on Delivery for orders within India. Please check the availability during checkout.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">2. What happens if my shipment does not get delivered on time?</p>
          <p>A: If your shipment is delayed, please contact our customer service team. We will work with the courier to resolve the issue promptly.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">3. Are there any shipping charges on delivery?</p>
          <p>A: Shipping charges depend on the shipping method selected and your delivery location. Exact fees will be calculated during checkout.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">4. Do we ship outside India?</p>
          <p>A: Currently, we only ship within India. We are working on expanding our services to international locations in the future.</p>
        </div>
      </div>

      {/* Cancellation Policy Questions */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cancellation Policy Questions</h2>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
        <div>
          <p className="font-semibold text-gray-900">Q: Can I cancel my order after it has been placed?</p>
          <p>A: Yes, you can cancel your order within 24 hours of placing it, provided it hasn’t been shipped. Please contact our customer service team immediately to request cancellation.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Q: What happens if my order has already been shipped?</p>
          <p>A: Unfortunately, orders cannot be canceled once they are shipped. However, you can initiate a return or exchange after receiving the product by following our return policy.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Q: Will I be charged a fee for canceling my order?</p>
          <p>A: No, there are no cancellation fees if the order is canceled within the allowed time frame.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Q: How will I receive a refund for my canceled order?</p>
          <p>A: Refunds for canceled orders will be processed to the original payment method within 7–10 business days.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Q: Can I cancel a part of my order and keep the rest?</p>
          <p>A: Yes, you can cancel specific items in your order if they haven’t been shipped yet. Contact our customer service team to assist you.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Q: What should I do if my cancellation request isn’t processed in time?</p>
          <p>A: If your request isn’t processed before the order is shipped, you can initiate a return once the product is delivered. Our team will assist you in ensuring a smooth process.</p>
        </div>
      </div>

      {/* Shipping Questions */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Questions</h2>
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <div>
            <p className="font-semibold text-gray-900">Q: What are your shipping options?</p>
            <p>A: We offer standard and express shipping options. Delivery times and costs vary based on your location and selected method.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: How long does shipping take?</p>
            <p>A: Standard shipping typically takes 5–7 business days, while express shipping delivers in 2–3 business days. Delivery times may vary depending on your location.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: What are the shipping charges?</p>
            <p>A: Shipping charges depend on the shipping method selected and your delivery location. Exact fees will be calculated during checkout.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: Do you offer free shipping?</p>
            <p>A: Yes, we provide free standard shipping on orders above ₹X (or equivalent). Terms and conditions apply.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: What happens if I refuse an order?</p>
            <p>A: If for any reason you did not want your package or were not satisfied with the shipment, you do have the option of refusing the package which you can reach out to the carrier directly and refuse delivery. Once the package has reached our facility we will be able to issue a refund for the order. Keep in mind that the shipping fee would not be included in the refund of the order when packages are refused.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: Can I change my shipping address after placing an order?</p>
            <p>A: If your order hasn’t been dispatched, you can contact our customer service team to update your shipping address. Once shipped, changes cannot be made.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: How can I track my shipment?</p>
            <p>A: After your order is dispatched, you’ll receive a confirmation email with a tracking number and link to monitor your shipment’s status.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: What happens if my package is delayed or lost?</p>
            <p>A: If your package is delayed or lost, please contact our customer service team. We will work with the courier to resolve the issue promptly.</p>
          </div>
        </div>
      </div>

      {/* Ordering Questions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ordering Questions</h2>
        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <div>
            <p className="font-semibold text-gray-900">Q: How do I place an order on your website?</p>
            <p>A: Simply browse through our collections, select your desired items, choose the appropriate size and color, and click “Add to Cart.” Once you’ve selected all your items, proceed to checkout to complete your order.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: Can I modify or cancel my order after it’s placed?</p>
            <p>A: If your order hasn’t been processed or shipped, you can request modifications or cancellations by contacting our customer service team as soon as possible.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: What payment methods do you accept?</p>
            <p>A: We accept major credit/debit cards, UPI, net banking, digital wallets like Paytm and Google Pay, and other secure payment methods displayed during checkout.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: Can I place an order without creating an account?</p>
            <p>A: Yes, you can place an order as a guest. However, creating an account allows you to track your orders, save your preferences, and enjoy a faster checkout process in the future.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: Can I change my order once it's placed?</p>
            <p>A: Unfortunately, once an order has been placed, we would not be able to make changes to the order. However, customers can reach out directly to the carrier and potentially have the package redirected to a new address or held at a postal location. If the package is returned to our facility, we are able to offer a reshipment, refund, or store credit once the package has been returned.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: Can I apply a discount code to my order?</p>
            <p>A: Yes, you can apply a valid discount code at checkout. Enter the code in the “Promo Code” field, and the discount will be applied to your total.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: I entered the wrong address! What can I do?</p>
            <p>A: Unfortunately, once an order has been placed, we would not be able to make changes to the order. But customers can reach out directly to the carrier and potentially have the package redirected to a new address or held at a postal location. If the package is returned to our facility, we are able to offer a reshipment, refund, or store credit once the package has been returned. We would not be liable for any misdeliveries if the package was marked delivered.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Q: What should I do if I receive the wrong item or my order is incomplete?</p>
            <p>A: If there’s an issue with your order, please contact us immediately with your order number and details. We’ll resolve the issue as quickly as possible.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
