import { LegalPage, LegalSection, LegalParagraph, LegalList, LegalContact } from '../components/visual';

export function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalParagraph muted>
        Last Updated: January 15, 2026
      </LegalParagraph>

      <LegalSection title="Overview">
        <LegalParagraph>
          WellAppoint is an appointment scheduling platform that helps healthcare providers manage their availability and appointments. This Privacy Policy explains how we collect, use, store, and protect your information when you use our service.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Information We Collect">
        <LegalParagraph>
          When you sign up as a provider on WellAppoint, we collect and access the following information through your Google Account:
        </LegalParagraph>
        <LegalList items={[
          "Email address - To identify your account and share administrative resources with you",
          "Name - To display to clients booking appointments",
          "Phone number (optional) - To display to clients for contact purposes",
          "Google Calendar access - To create and manage a dedicated 'WellAppoint' calendar for your availability"
        ]} />
        <LegalParagraph>
          For clients booking appointments, we only collect:
        </LegalParagraph>
        <LegalList items={[
          "Email address - To identify your account and send appointment confirmations",
          "Name - Provided by your Google account for appointment records"
        ]} />
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <LegalParagraph>
          <strong>For Providers:</strong>
        </LegalParagraph>
        <LegalList items={[
          "Create a dedicated 'WellAppoint' calendar in your Google Calendar to manage availability (we do not access your other calendars)",
          "Store availability blocks you mark in your WellAppoint calendar",
          "Create appointment events in your WellAppoint calendar when clients book with you",
          "Share an administrative spreadsheet with you for configuring services and settings",
          "Display your name, title, and contact information to clients on your booking page"
        ]} />
        <LegalParagraph>
          <strong>For Clients:</strong>
        </LegalParagraph>
        <LegalList items={[
          "Create appointment records in the provider's system",
          "Send appointment confirmations and reminders",
          "Allow providers to view your appointment history with them"
        ]} />
      </LegalSection>

      <LegalSection title="How We Store Your Information">
        <LegalParagraph>
          We use Google's infrastructure to store all data:
        </LegalParagraph>
        <LegalList items={[
          "Calendar data - Stored in your Google Calendar account (WellAppoint calendar)",
          "Appointment data - Stored in Google Sheets accessible only to the provider",
          "Account information - Stored in Google Sheets with encrypted OAuth tokens",
          "No data is stored on third-party servers outside of Google's infrastructure"
        ]} />
        <LegalParagraph>
          We do NOT:
        </LegalParagraph>
        <LegalList items={[
          "Access your primary Google Calendar or any calendars we did not create - we only access the WellAppoint calendar that we create in your account",
          "Access any Google data beyond the WellAppoint calendar and your email address",
          "Store your Google password or credentials",
          "Share your data with third parties for marketing or advertising",
          "Sell or trade your personal information"
        ]} />
      </LegalSection>

      <LegalSection title="Data Security">
        <LegalParagraph>
          We implement the following security measures:
        </LegalParagraph>
        <LegalList items={[
          "OAuth 2.0 authentication through Google",
          "HTTPS encryption for all data transmitted",
          "Secure storage of OAuth refresh tokens",
          "Access controls ensuring only you can access your data",
          "Regular security updates and monitoring"
        ]} />
      </LegalSection>

      <LegalSection title="Your Rights and Choices">
        <LegalParagraph>
          You have the following rights regarding your data:
        </LegalParagraph>
        <LegalList items={[
          "Access - View all data we have about you through your account dashboard",
          "Export - Download your appointment and availability data at any time",
          "Revoke Access - Disconnect WellAppoint from your Google Account at any time through your account settings or Google Account settings",
          "Delete - Request complete deletion of your account and all associated data",
          "Modify - Update your profile information, phone number, and other settings at any time"
        ]} />
        <LegalParagraph>
          To exercise these rights, visit your account settings or contact us at the information provided below.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Data Retention">
        <LegalParagraph>
          We retain your data for as long as your account is active. When you delete your account or revoke access:
        </LegalParagraph>
        <LegalList items={[
          "Your WellAppoint calendar is deleted from your Google Calendar",
          "Your administrative spreadsheet is deleted",
          "Your entry is removed from our provider registry",
          "OAuth tokens are revoked and deleted",
          "All data is typically deleted within 24 hours of account deletion"
        ]} />
        <LegalParagraph>
          We may retain minimal information as required by law for fraud prevention and legal compliance.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Google OAuth Scopes">
        <LegalParagraph>
          WellAppoint requests the following Google OAuth scopes:
        </LegalParagraph>
        <LegalList items={[
          "calendar.app.created - Access ONLY to calendars created by WellAppoint. This allows us to create, read, update, and delete your WellAppoint calendar. We cannot access or see any other calendars in your Google account.",
          "userinfo.email - Read your email address for account identification"
        ]} />
        <LegalParagraph>
          These permissions are requested during the authorization process. You can review and revoke these permissions at any time through your Google Account settings at myaccount.google.com/permissions.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Cookies and Tracking">
        <LegalParagraph>
          We use minimal cookies for:
        </LegalParagraph>
        <LegalList items={[
          "Authentication session management",
          "Maintaining your login state",
          "Security and fraud prevention"
        ]} />
        <LegalParagraph>
          We do not use cookies for advertising or tracking across websites.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Third-Party Services">
        <LegalParagraph>
          We use the following third-party services:
        </LegalParagraph>
        <LegalList items={[
          "Google Calendar API - For calendar management",
          "Google Sheets API - For data storage",
          "Google Drive API - For file management",
          "Google OAuth 2.0 - For secure authentication"
        ]} />
        <LegalParagraph>
          All third-party services are subject to their own privacy policies. We only share data necessary for these services to function.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Children's Privacy">
        <LegalParagraph>
          WellAppoint is not intended for use by individuals under the age of 18. We do not knowingly collect information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Changes to This Policy">
        <LegalParagraph>
          We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a prominent notice in the application. Your continued use of WellAppoint after such modifications constitutes your acknowledgment and acceptance of the modified policy.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="International Data Transfers">
        <LegalParagraph>
          Your data is stored on Google's infrastructure, which may be located in various countries. By using WellAppoint, you consent to the transfer of your information to these locations. Google complies with applicable data protection regulations.
        </LegalParagraph>
      </LegalSection>

      <LegalSection title="Contact Us">
        <LegalParagraph>
          If you have questions about this Privacy Policy or how we handle your data, please contact us:
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
