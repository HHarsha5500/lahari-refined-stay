
import React from 'react';
import Navigation from '@/components/Navigation';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="container-custom max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-800 mb-4">
              Privacy Policy & Terms
            </h1>
            <p className="text-lg text-gray-600">
              Your privacy and satisfaction are our top priorities
            </p>
          </div>

          {/* Privacy Policy Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-navy-800 mb-6">Privacy Policy</h2>
            <p className="text-gray-700 mb-6">
              Our privacy policy outlines how we collect, use, disclose, and protect your personal information when you use our services.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">1. Information Collection and Use</h3>
                <p className="text-gray-700 mb-2">
                  We collect personal information such as name, email address, phone number, and payment details when you make a reservation or interact with our website.
                </p>
                <p className="text-gray-700">
                  Your information is used to process bookings, improve our services, and communicate with you about your reservations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">2. Data Security</h3>
                <p className="text-gray-700 mb-2">
                  We employ industry-standard security measures to safeguard your personal information from unauthorized access, disclosure, alteration, or destruction.
                </p>
                <p className="text-gray-700">
                  Your payment details are encrypted and securely transmitted using SSL technology.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">3. Information Sharing</h3>
                <p className="text-gray-700 mb-2">
                  We may share your personal information with trusted third parties, such as payment processors and service providers, to facilitate your bookings and improve our services.
                </p>
                <p className="text-gray-700">
                  Your information may also be shared in response to legal requests or to protect our rights, property, or safety.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">4. Cookies and Tracking Technologies</h3>
                <p className="text-gray-700 mb-2">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content.
                </p>
                <p className="text-gray-700">
                  You have the option to disable cookies through your browser settings, although this may affect certain features of our website.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">5. Third-Party Links</h3>
                <p className="text-gray-700 mb-2">
                  Our website may contain links to third-party websites or services that are not owned or controlled by us.
                </p>
                <p className="text-gray-700">
                  We are not responsible for the privacy practices or content of these third-party sites and encourage you to review their privacy policies.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">6. Data Retention</h3>
                <p className="text-gray-700">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy or as required by law.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">7. Your Rights</h3>
                <p className="text-gray-700">
                  You have the right to access, update, or delete your personal information stored in our systems. Please contact us if you would like to exercise these rights.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">8. Policy Updates</h3>
                <p className="text-gray-700">
                  We may update this privacy policy periodically to reflect changes in our practices or legal requirements. Any revisions will be posted on this page, and we encourage you to review the policy regularly.
                </p>
              </div>
            </div>

            <div className="bg-gold-50 p-6 rounded-xl mt-8">
              <p className="text-gray-700 mb-4">
                By using our services, you consent to the collection and use of your personal information as described in this privacy policy.
              </p>
              <p className="text-gray-700">
                If you have any questions or concerns about our privacy practices, please contact us at <strong>+919888648886</strong>.
              </p>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Booking and Refund Policy Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-navy-800 mb-6">Booking & Refund Policy</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">Booking</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>All bookings are subject to availability.</li>
                  <li>Reservations must be made in advance, and confirmation is subject to payment and availability.</li>
                  <li>Payment must be made in full at the time of booking unless otherwise specified.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">Cancellation and Refund</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Cancellation policies vary depending on the booking type and terms.</li>
                  <li>Refunds, if applicable, will be processed according to our cancellation policy.</li>
                  <li>No-shows and early departures may be subject to charges.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">Amendment</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Changes to bookings, including dates and room types, are subject to availability and may incur additional charges.</li>
                  <li>Amendments must be made within the specified time frame according to our policy.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">Refund Processing</h3>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-gray-700 mb-2">
                    <strong>15 days before check-in date:</strong> Cancellation fee 50%. Refund initiated within 48 hours of receiving the request.
                  </p>
                  <p className="text-gray-700">
                    Payment credited within 10 working days via the same mode as used for booking.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">Special Circumstances</h3>
                <p className="text-gray-700">
                  In case of unforeseen circumstances or force majeure events, such as natural disasters or government restrictions, we reserve the right to modify or cancel bookings without penalty. Guests will be notified promptly of any changes to their bookings in such cases.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-navy-700 mb-3">Contact Information</h3>
                <p className="text-gray-700">
                  For any inquiries regarding booking, cancellations, or refunds, please contact our customer service team at <strong>+919888648886</strong>.
                </p>
              </div>
            </div>
          </section>

          <Separator className="my-12" />

          {/* Terms of Use Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-navy-800 mb-6">Terms of Use</h2>
            <p className="text-gray-700 mb-6">
              The Management of Hotel Lahari International wishes to inform all guests about the policies and regulations in place for a pleasant and secure stay at our establishment.
            </p>

            <div className="space-y-6">
              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <p className="text-gray-700">
                  It is important to note that the Management is not liable for any personal belongings or valuables such as money, jewellery, or other items left by guests in the rooms. We advise all guests to take necessary precautions to safeguard their possessions.
                </p>
              </div>

              <div>
                <p className="text-gray-700">
                  Our standard Check-in and Check-out times are set at <strong>2 PM and 11 AM</strong> respectively. Requests for early Check-in or late Check-out will be considered based on hotel availability at the time of arrival or departure, with an additional fee that may apply.
                </p>
              </div>

              <div>
                <p className="text-gray-700">
                  Hotel Lahari International strictly upholds a zero-tolerance policy towards unmarried couples attempting to pass as a "married couple" without providing suitable proof of authentication during check-in. Both male and female guests are required to present authenticated identification demonstrating a legitimate relationship. The service apartment reserves the right of admission, and accommodation may be denied or revoked without explanation in cases of suspected illegitimate use of the property.
                </p>
              </div>

              <div>
                <p className="text-gray-700">
                  Guests are expected to maintain decorum and refrain from unruly behaviour or causing disturbances due to intoxication. Accommodation will be refused or withdrawn if such behaviour is observed.
                </p>
              </div>

              <div>
                <p className="text-gray-700">
                  In the event of damage or removal of items caused by deliberate negligence or reckless acts of guests towards our property or amenities, guests will be held accountable for the costs of rectification.
                </p>
              </div>

              <div>
                <p className="text-gray-700">
                  Guests are responsible for any loss or damage to Hotel Lahari International resulting from their actions, the actions of their friends, or any individuals for whom they are responsible.
                </p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <p className="text-gray-700">
                  <strong>100% Non-Smoking Property:</strong> Hotel Lahari International operates as a 100% Non-Smoking property. Guests found violating this policy by smoking in the rooms will be subject to a charge of <strong>Rs 1000</strong> for deep cleaning purposes.
                </p>
              </div>

              <div className="bg-gold-50 p-6 rounded-xl">
                <p className="text-gray-700">
                  We appreciate your cooperation in adhering to these guidelines to ensure a safe and enjoyable experience for all guests at Hotel Lahari International.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-navy-800 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-lg">
                <strong>Address:</strong> Dubbak - Kanteshwar Rd, beside Royaloak, Nizamabad, Telangana 503001
              </p>
              <p className="text-lg">
                <strong>Phone:</strong> +919888648886, 08462-243366
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
