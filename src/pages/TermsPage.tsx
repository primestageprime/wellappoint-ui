import { LegalPage, LegalSection, LegalParagraph, LegalList, LegalContact } from '../components/visual';

export function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <LegalParagraph muted>
        Last Updated: January 15, 2026
      </LegalParagraph>

      <LegalSection title="Agreement to Terms">
        <LegalParagraph>
          These Terms of Service ("Terms") govern your access to and use of WellAppoint, an appointment scheduling platform that helps healthcare providers manage their availability and appointments. By using WellAppoint, you agree to be bound by these Terms.
        </LegalParagraph>
        <LegalParagraph>
          If you do not agree to these Terms, you may not access or use the Service.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Definitions">
        <LegalParagraph>
          <strong>Service</strong> refers to WellAppoint, the appointment scheduling platform accessible through this application.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Provider</strong> refers to healthcare providers or professionals who create accounts to manage their availability and appointments.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Client</strong> refers to individuals who book appointments with Providers through the Service.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Company</strong>, <strong>We</strong>, <strong>Us</strong>, or <strong>Our</strong> refers to PRIMESTAGE, 4315 LaQuinta Drive, Carpinteria CA 93013, the operator of WellAppoint.
        </LegalParagraph>
        <LegalParagraph>
          <strong>You</strong> or <strong>Your</strong> refers to the individual accessing or using the Service.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Description of Service">
        <LegalParagraph>
          WellAppoint provides appointment scheduling services that:
        </LegalParagraph>
        <LegalList items={[
          "Enable Providers to manage their availability through Google Calendar integration",
          "Allow Clients to view Provider availability and book appointments",
          "Create and manage appointment records",
          "Send appointment confirmations and reminders",
          "Provide administrative tools for Providers to configure services and settings"
        ]} />
      </LegalSection>

      <LegalSection title="Account Registration and Authorization">
        <LegalParagraph>
          <strong>Provider Accounts:</strong>
        </LegalParagraph>
        <LegalParagraph>
          To use WellAppoint as a Provider, you must:
        </LegalParagraph>
        <LegalList items={[
          "Be at least 18 years of age",
          "Have a valid Google Account",
          "Authorize WellAppoint to access your Google Calendar and email through Google OAuth",
          "Provide accurate and complete registration information",
          "Maintain the security of your account credentials"
        ]} />
        <LegalParagraph>
          By authorizing WellAppoint through Google OAuth, you grant us permission to:
        </LegalParagraph>
        <LegalList items={[
          "Create a dedicated 'WellAppoint' calendar in your Google Calendar",
          "Read, create, update, and delete events in your WellAppoint calendar",
          "Access your email address for account identification",
          "Share administrative resources with your Google account"
        ]} />
        <LegalParagraph>
          You may revoke these permissions at any time through your account settings or through your Google Account settings at myaccount.google.com/permissions.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Client Accounts:</strong>
        </LegalParagraph>
        <LegalParagraph>
          To book appointments as a Client, you must have a valid Google Account and authorize WellAppoint to access your email address for appointment confirmations.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Provider Responsibilities">
        <LegalParagraph>
          As a Provider using WellAppoint, you agree to:
        </LegalParagraph>
        <LegalList items={[
          "Maintain accurate availability information in your WellAppoint calendar",
          "Honor appointments booked by Clients in good faith",
          "Provide accurate contact information (name, email, phone number)",
          "Respond to Client inquiries and appointment requests in a timely manner",
          "Comply with all applicable laws and regulations governing your professional practice",
          "Not use the Service for any unlawful or unauthorized purpose",
          "Not interfere with or disrupt the Service or servers"
        ]} />
        <LegalParagraph>
          You are solely responsible for your interactions with Clients and the professional services you provide. WellAppoint is not a party to any agreements between Providers and Clients.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Client Responsibilities">
        <LegalParagraph>
          As a Client using WellAppoint, you agree to:
        </LegalParagraph>
        <LegalList items={[
          "Provide accurate information when booking appointments",
          "Attend scheduled appointments or provide reasonable notice of cancellation",
          "Comply with the Provider's cancellation and rescheduling policies",
          "Not use the Service to book appointments in bad faith or for fraudulent purposes",
          "Respect Provider availability and booking policies"
        ]} />
      </LegalSection>

      <LegalSection title="Calendar and Data Access">
        <LegalParagraph>
          By using WellAppoint, you acknowledge and agree that:
        </LegalParagraph>
        <LegalList items={[
          "We create a dedicated 'WellAppoint' calendar in your Google Calendar account",
          "We only access the WellAppoint calendar we create, not your other calendars",
          "Availability you mark in the WellAppoint calendar is used to display booking options to Clients",
          "We store appointment data in Google Sheets accessible only to you as the Provider",
          "All data is stored on Google's infrastructure and subject to Google's security practices",
          "You retain ownership of your data and can export or delete it at any time"
        ]} />
      </LegalSection>

      <LegalSection title="Fees and Payment">
        <LegalParagraph>
          WellAppoint is currently provided free of charge. We reserve the right to introduce fees for the Service in the future. If we do, we will provide you with advance notice and an opportunity to accept or decline the new terms before any charges are applied.
        </LegalParagraph>
        <LegalParagraph>
          Payment arrangements between Providers and Clients for professional services are separate from WellAppoint and are the sole responsibility of the parties involved.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Cancellation and Rescheduling">
        <LegalParagraph>
          Cancellation and rescheduling policies are determined by each Provider. Clients should review and comply with the Provider's policies when booking appointments. WellAppoint is not responsible for enforcing Provider cancellation policies or mediating disputes.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Service Availability">
        <LegalParagraph>
          We strive to provide reliable and uninterrupted access to WellAppoint. However, we do not guarantee that:
        </LegalParagraph>
        <LegalList items={[
          "The Service will be available at all times without interruption",
          "The Service will be error-free or secure",
          "Any defects or errors will be corrected",
          "The Service will meet your specific requirements"
        ]} />
        <LegalParagraph>
          We may modify, suspend, or discontinue the Service at any time with or without notice.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Acceptable Use">
        <LegalParagraph>
          You agree not to use WellAppoint to:
        </LegalParagraph>
        <LegalList items={[
          "Violate any applicable laws or regulations",
          "Infringe on intellectual property rights of others",
          "Transmit harmful, offensive, or inappropriate content",
          "Impersonate another person or entity",
          "Attempt to gain unauthorized access to the Service or other users' accounts",
          "Use automated systems (bots, scrapers) to access the Service",
          "Interfere with the proper functioning of the Service",
          "Engage in fraudulent activities or spam"
        ]} />
      </LegalSection>

      <LegalSection title="Account Termination">
        <LegalParagraph>
          <strong>Your Rights:</strong>
        </LegalParagraph>
        <LegalParagraph>
          You may terminate your account at any time by:
        </LegalParagraph>
        <LegalList items={[
          "Accessing your account settings and selecting the delete account option",
          "Revoking WellAppoint's access through your Google Account settings",
          "Contacting us at the information provided below"
        ]} />
        <LegalParagraph>
          Upon termination, we will delete your WellAppoint calendar, administrative spreadsheet, and remove your account from our system within 24 hours.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Our Rights:</strong>
        </LegalParagraph>
        <LegalParagraph>
          We may suspend or terminate your access to WellAppoint immediately, without prior notice, if:
        </LegalParagraph>
        <LegalList items={[
          "You breach these Terms of Service",
          "You engage in fraudulent or illegal activities",
          "You misuse the Service in a way that harms other users or the Service",
          "Required by law or legal process",
          "We cease providing the Service to all users"
        ]} />
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <LegalParagraph>
          WellAppoint and its original content, features, and functionality are owned by PRIMESTAGE and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </LegalParagraph>
        <LegalParagraph>
          You retain all rights to the content and data you provide through the Service, including appointment information and Provider details.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <LegalParagraph>
          WellAppoint integrates with Google services including:
        </LegalParagraph>
        <LegalList items={[
          "Google Calendar API",
          "Google Sheets API",
          "Google Drive API",
          "Google OAuth 2.0"
        ]} />
        <LegalParagraph>
          Your use of these services is subject to Google's Terms of Service and Privacy Policy. We are not responsible for the practices or content of third-party services.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Privacy and Data Protection">
        <LegalParagraph>
          Your privacy is important to us. Our Privacy Policy explains how we collect, use, store, and protect your information. By using WellAppoint, you also agree to our Privacy Policy, available at /privacy.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Disclaimers and Limitation of Liability">
        <LegalParagraph>
          <strong>Service "AS IS":</strong>
        </LegalParagraph>
        <LegalParagraph>
          WellAppoint is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
        </LegalParagraph>
        <LegalParagraph>
          <strong>No Medical Advice:</strong>
        </LegalParagraph>
        <LegalParagraph>
          WellAppoint is a scheduling tool only. We do not provide medical advice, diagnosis, or treatment. Providers are solely responsible for the professional services they provide to Clients.
        </LegalParagraph>
        <LegalParagraph>
          <strong>Limitation of Liability:</strong>
        </LegalParagraph>
        <LegalParagraph>
          To the maximum extent permitted by law, PRIMESTAGE and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
        </LegalParagraph>
        <LegalList items={[
          "Loss of profits, data, or goodwill",
          "Service interruptions or data loss",
          "Missed appointments or scheduling errors",
          "Disputes between Providers and Clients",
          "Unauthorized access to your account or data",
          "Any other damages arising from your use of the Service"
        ]} />
        <LegalParagraph>
          Our total liability for any claims arising from these Terms or your use of WellAppoint shall not exceed $100 USD.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Indemnification">
        <LegalParagraph>
          You agree to indemnify, defend, and hold harmless PRIMESTAGE, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from:
        </LegalParagraph>
        <LegalList items={[
          "Your use of the Service",
          "Your violation of these Terms",
          "Your violation of any rights of another party",
          "Professional services provided by Providers to Clients",
          "Any content or information you submit through the Service"
        ]} />
      </LegalSection>

      <LegalSection title="Changes to Terms">
        <LegalParagraph>
          We may update these Terms from time to time. We will notify you of significant changes by:
        </LegalParagraph>
        <LegalList items={[
          "Sending an email to the address associated with your account",
          "Displaying a prominent notice within the Service",
          "Updating the 'Last Updated' date at the top of these Terms"
        ]} />
        <LegalParagraph>
          Your continued use of WellAppoint after changes become effective constitutes your acceptance of the revised Terms. If you do not agree to the changes, you must stop using the Service and may delete your account.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Governing Law and Disputes">
        <LegalParagraph>
          These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles.
        </LegalParagraph>
        <LegalParagraph>
          Any disputes arising from these Terms or your use of WellAppoint shall be resolved through:
        </LegalParagraph>
        <LegalList items={[
          "First, informal negotiation by contacting us",
          "If unresolved, binding arbitration in accordance with the rules of the American Arbitration Association",
          "Arbitration shall take place in Carpinteria, California"
        ]} />
        <LegalParagraph>
          You waive any right to participate in class action lawsuits or class-wide arbitration.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Severability">
        <LegalParagraph>
          If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Entire Agreement">
        <LegalParagraph>
          These Terms, together with our Privacy Policy, constitute the entire agreement between you and PRIMESTAGE regarding WellAppoint and supersede any prior agreements.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Contact Us">
        <LegalParagraph>
          If you have questions about these Terms of Service, please contact us:
        </LegalParagraph>
      </LegalSection>

      <LegalContact
        email="hello@primestagetechnology.com"
        phone="805-637-8126"
        website="https://primestage.dev/contact"
      />
    </LegalPage>
  );
}

