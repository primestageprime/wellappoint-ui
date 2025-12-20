import { LegalPage, LegalSection, LegalParagraph, LegalContact } from '../components/visual';

export function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" lastUpdated="December 2025">
      <LegalSection title="Interpretation and Definitions">
        <LegalParagraph>
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Definitions">
        <LegalParagraph>
          <strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Country</strong> refers to: California, United States.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to PRIMESTAGE, 4315 LaQuinta Drive, Carpinteria CA 93013.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Service</strong> refers to the Website.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Website</strong> refers to WellAppoint, accessible from this application.
        </LegalParagraph>
        <LegalParagraph>
          <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Acknowledgment">
        <LegalParagraph>
          These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
        </LegalParagraph>
        <LegalParagraph>
          Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
        </LegalParagraph>
        <LegalParagraph>
          By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
        </LegalParagraph>
        <LegalParagraph>
          You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Links to Other Websites">
        <LegalParagraph>
          Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
        </LegalParagraph>
        <LegalParagraph>
          The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Termination">
        <LegalParagraph>
          We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
        </LegalParagraph>
        <LegalParagraph>
          Upon termination, Your right to use the Service will cease immediately.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <LegalParagraph>
          Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.
        </LegalParagraph>
        <LegalParagraph>
          To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title={'"AS IS" and "AS AVAILABLE" Disclaimer'}>
        <LegalParagraph>
          The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Governing Law">
        <LegalParagraph>
          The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Disputes Resolution">
        <LegalParagraph>
          If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Changes to These Terms and Conditions">
        <LegalParagraph>
          We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect.
        </LegalParagraph>
        <LegalParagraph>
          By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.
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

