import { LegalPage, LegalSection, LegalParagraph, LegalList, LegalContact } from '../components/visual';

export function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection title="What information do we collect?">
        <LegalParagraph>
          We collect information from you when you register on our site, respond to a survey, or fill out a form.
        </LegalParagraph>
        <LegalParagraph>
          When ordering or registering on our site, you may be asked to enter your: name, e-mail address, mailing address, or phone number. You may, however, visit our site anonymously.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="What do we use your information for?">
        <LegalParagraph>
          Any of the information we collect from you may be used in one of the following ways:
        </LegalParagraph>
        <LegalList items={[
          "Improve our website as we continually strive to improve our website offerings based on the information and feedback we receive from you",
          "Improve customer service — your information helps us to more effectively respond to your customer service requests and support needs",
          "Send periodic emails about occasional company news, updates, related product or service information",
          "Send you information and updates pertaining to your order"
        ]} />
        <LegalParagraph muted>
          Note: If at any time you would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="How do we protect your information?">
        <LegalParagraph>
          We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Do we use cookies?">
        <LegalParagraph>
          Yes, we use cookies (small files that a site or its service provider transfers to your computer's hard drive through your web browser) that enable the sites or service providers systems to recognize your browser and capture and remember certain information.
        </LegalParagraph>
        <LegalParagraph>
          We use cookies to compile aggregate data about site traffic and site interaction. That way, we can offer better site experiences and tools in the future. We may contract with third-party service providers to assist us in better understanding our site visitors. These service providers are not permitted to use the information collected on our behalf except to help us conduct and improve our business.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Do we disclose any information to outside parties?">
        <LegalParagraph>
          Based on our privacy policy, we do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
        </LegalParagraph>
        <LegalParagraph>
          We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety. However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Third-party links">
        <LegalParagraph>
          Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We, therefore, have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
        </LegalParagraph>
      </LegalSection>

      <LegalContact 
        email="info@primestage.dev"
        phone="805-637-8126"
        website="https://primestage.dev/contact"
      />
    </LegalPage>
  );
}
