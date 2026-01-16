import { createSignal, Show, onMount } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { useAuth } from '../auth/AuthProvider';
import {
  PageFrame,
  Card,
  StandardButton,
  DangerButton,
  SectionHeading,
  H3,
  Spinner,
} from '../components/visual';
import { revokeProviderAccess, exportProviderData, deleteProviderAccount } from '../services/providerService';

export function ProviderSettingsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const username = () => params.username as string;

  const [isLoading, setIsLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [successMessage, setSuccessMessage] = createSignal<string | null>(null);

  // Check if user is authenticated
  onMount(() => {
    if (!auth.isAuthenticated()) {
      navigate('/');
    }
  });

  const handleRevokeAccess = async () => {
    const confirmed = confirm(
      'Are you sure you want to revoke WellAppoint\'s access to your Google account?\n\n' +
      'This will:\n' +
      '- Revoke all Google Calendar permissions\n' +
      '- Sign you out of WellAppoint\n' +
      '- Prevent new appointment bookings\n\n' +
      'Your data will remain stored. To fully delete your account and data, use the "Delete Account" option instead.\n\n' +
      'You can re-authorize access at any time by signing in again.'
    );

    if (!confirmed) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await revokeProviderAccess(username());
      setSuccessMessage('Access revoked successfully.');

      // Redirect to providers list after a delay
      setTimeout(() => {
        navigate('/admin/providers');
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to revoke access';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const data = await exportProviderData(username());

      // Create a downloadable JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wellappoint-${username()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMessage('Data exported successfully!');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to export data';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'WARNING: This will permanently delete your WellAppoint account!\n\n' +
      'This action will:\n' +
      '- Delete your WellAppoint calendar from Google Calendar\n' +
      '- Delete your administrative spreadsheet\n' +
      '- Remove your provider listing\n' +
      '- Revoke all access permissions\n' +
      '- Delete all appointment data\n\n' +
      'This action CANNOT be undone!\n\n' +
      'Are you absolutely sure you want to continue?'
    );

    if (!confirmed) return;

    // Second confirmation
    const doubleConfirmed = confirm(
      `Final confirmation: This will permanently delete the account for provider "${username()}".\n\n` +
      'Are you really sure you want to permanently delete this account?'
    );

    if (!doubleConfirmed) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await deleteProviderAccount(username());
      setSuccessMessage('Account deleted successfully.');

      // Redirect to providers list after a delay
      setTimeout(() => {
        navigate('/admin/providers');
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete account';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageFrame>
      <div class="max-w-4xl mx-auto p-6">
        <H3>Account Settings for {username()}</H3>

        <Show when={errorMessage()}>
          <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
            {errorMessage()}
          </div>
        </Show>

        <Show when={successMessage()}>
          <div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
            {successMessage()}
          </div>
        </Show>

        {/* Permissions Section */}
        <Card class="mb-6">
          <SectionHeading>Google Account Permissions</SectionHeading>
          <p class="text-sm text-muted-foreground mb-4">
            WellAppoint has access to the following Google Account permissions:
          </p>
          <ul class="list-disc list-inside space-y-2 text-sm mb-4">
            <li>
              <strong>Google Calendar:</strong> Full access to create, manage, and delete the WellAppoint calendar
            </li>
            <li>
              <strong>Email Address:</strong> Read your email address for account identification
            </li>
          </ul>
          <p class="text-xs text-muted-foreground">
            You can also manage these permissions directly through your{' '}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary underline"
            >
              Google Account settings
            </a>
            .
          </p>
        </Card>

        {/* Data Storage Section */}
        <Card class="mb-6">
          <SectionHeading>Data Storage</SectionHeading>
          <p class="text-sm text-muted-foreground mb-4">
            WellAppoint stores the following data in your Google Account:
          </p>
          <ul class="list-disc list-inside space-y-2 text-sm mb-4">
            <li>
              <strong>WellAppoint Calendar:</strong> Availability blocks and appointment events stored in a dedicated calendar
            </li>
            <li>
              <strong>Administrative Spreadsheet:</strong> Service configurations, appointment records, and provider settings
            </li>
            <li>
              <strong>Provider Information:</strong> Name, email, phone number (optional), and booking page details
            </li>
          </ul>
          <p class="text-xs text-muted-foreground">
            All data is stored on Google's infrastructure. We do not store any data on third-party servers.
          </p>
        </Card>

        {/* Legal Documents Section */}
        <Card class="mb-6">
          <SectionHeading>Legal & Privacy</SectionHeading>
          <div class="space-y-2">
            <div>
              <a href="/privacy" class="text-primary underline text-sm">
                Privacy Policy
              </a>
              <p class="text-xs text-muted-foreground">
                Learn how we collect, use, and protect your information
              </p>
            </div>
            <div>
              <a href="/terms" class="text-primary underline text-sm">
                Terms of Service
              </a>
              <p class="text-xs text-muted-foreground">
                Review the terms governing your use of WellAppoint
              </p>
            </div>
          </div>
        </Card>

        {/* Data Management Actions */}
        <Card class="mb-6">
          <SectionHeading>Data Management</SectionHeading>

          <div class="space-y-4">
            {/* Export Data */}
            <div>
              <h4 class="text-sm font-semibold mb-2">Export Your Data</h4>
              <p class="text-sm text-muted-foreground mb-3">
                Download a copy of your provider information, services, and appointment history in JSON format.
              </p>
              <StandardButton
                onClick={handleExportData}
                disabled={isLoading()}
                variant="outline"
              >
                <Show when={!isLoading()} fallback={<Spinner />}>
                  Export Data (JSON)
                </Show>
              </StandardButton>
            </div>

            {/* Revoke Access */}
            <div class="border-t pt-4">
              <h4 class="text-sm font-semibold mb-2">Revoke Access</h4>
              <p class="text-sm text-muted-foreground mb-3">
                Revoke WellAppoint's access to your Google Calendar and email. Your data will remain stored but new appointments cannot be booked until you re-authorize.
              </p>
              <StandardButton
                onClick={handleRevokeAccess}
                disabled={isLoading()}
                variant="secondary"
              >
                <Show when={!isLoading()} fallback={<Spinner />}>
                  Revoke Access
                </Show>
              </StandardButton>
            </div>

            {/* Delete Account */}
            <div class="border-t pt-4">
              <h4 class="text-sm font-semibold mb-2 text-red-600">Delete Account</h4>
              <p class="text-sm text-muted-foreground mb-3">
                Permanently delete your WellAppoint account, calendar, administrative spreadsheet, and all associated data. This action cannot be undone.
              </p>
              <DangerButton
                onClick={handleDeleteAccount}
                disabled={isLoading()}
              >
                <Show when={!isLoading()} fallback={<Spinner />}>
                  Delete Account Permanently
                </Show>
              </DangerButton>
            </div>
          </div>
        </Card>

        {/* Back to Admin */}
        <div class="text-center">
          <StandardButton
            onClick={() => navigate(`/admin/${username()}`)}
            variant="outline"
          >
            Back to Admin Dashboard
          </StandardButton>
        </div>
      </div>
    </PageFrame>
  );
}
