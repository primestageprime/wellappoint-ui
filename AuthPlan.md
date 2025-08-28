# WellAppoint Authentication Plan

## Overview
This document outlines the authentication strategy for WellAppoint, a scheduling system that uses Google Sheets as a data store and integrates with Google Calendar for appointment management.

## System Architecture

### Backend (Your Google API Project)
Your application needs to:
- Copy and manage Google Sheets templates
- Read/write to Google Sheets for data storage
- Create/manage Google Calendar events
- Calculate distances for location-based services

### Provider OAuth
Providers need to:
- Grant access to create a "WellAppoint" calendar in their Google account
- Allow adding/removing events from the WellAppoint calendar only
- No access to other calendars

### Client OAuth
Clients need to:
- Grant access to read their email address
- Optionally read name, phone, address
- Allow adding their email to calendar invites

## Required Scopes

### Backend Google API Project Scopes

#### Google Drive API
```
https://www.googleapis.com/auth/drive.file
```
- **Purpose**: Copy spreadsheet templates, manage WellAppoint-related files
- **Minimal scope**: `.file` scope limits access to files created by the app

#### Google Sheets API
```
https://www.googleapis.com/auth/spreadsheets
```
- **Purpose**: Read/write to Google Sheets for appointment data, provider info, etc.
- **Note**: Full access needed for data management

#### Google Calendar API
```
https://www.googleapis.com/auth/calendar
```
- **Purpose**: Create/manage calendar events, send invites
- **Note**: Full access needed for comprehensive calendar management

#### Google Maps API
```
https://www.googleapis.com/auth/maps-platform.distance-matrix
```
- **Purpose**: Calculate distances between locations for scheduling
- **Alternative**: Consider using the Distance Matrix API without OAuth for public data

### Provider OAuth Scopes

#### Calendar Access (Primary)
```
https://www.googleapis.com/auth/calendar.events
```
- **Purpose**: Create, read, update, delete events in the WellAppoint calendar
- **Scope**: Limited to calendar events only

#### Calendar Settings (Secondary)
```
https://www.googleapis.com/auth/calendar.settings.readonly
```
- **Purpose**: Read calendar settings to ensure proper integration
- **Scope**: Read-only access to calendar settings

### Client OAuth Scopes

#### Email Access (Primary)
```
https://www.googleapis.com/auth/userinfo.email
```
- **Purpose**: Read client's email address for calendar invites
- **Scope**: Email address only

#### Profile Access (Optional)
```
https://www.googleapis.com/auth/userinfo.profile
```
- **Purpose**: Read name, phone, address if provided
- **Scope**: Basic profile information
- **Note**: Make this optional in the OAuth flow

## Implementation Steps

### 1. Google Cloud Console Setup
1. Create a new Google Cloud Project
2. Enable required APIs:
   - Google Drive API
   - Google Sheets API
   - Google Calendar API
   - Google Maps Platform API
3. Create OAuth 2.0 credentials for web application
4. Configure authorized redirect URIs for your domain

### 2. Backend Service Account
1. Create a service account for backend operations
2. Download the JSON key file
3. Grant necessary permissions to the service account for your Google Sheets templates

### 3. OAuth Flow Implementation

#### Provider OAuth Flow
1. Redirect provider to Google OAuth with calendar scopes
2. After authorization, create "WellAppoint" calendar if it doesn't exist
3. Store the refresh token securely for future calendar operations
4. Use the access token for immediate calendar operations

#### Client OAuth Flow
1. Redirect client to Google OAuth with email/profile scopes
2. Request minimal permissions (email required, profile optional)
3. Store email address for calendar invites
4. Optionally store profile information if provided

### 4. Security Considerations
1. **Token Storage**: Store refresh tokens securely (encrypted database)
2. **Scope Minimization**: Only request scopes that are immediately needed
3. **Calendar Isolation**: Ensure WellAppoint calendar is separate from other calendars
4. **Data Privacy**: Only access data that's explicitly authorized
5. **Token Refresh**: Implement proper token refresh mechanisms

### 5. Calendar Management Strategy
1. **Calendar Creation**: Create a dedicated "WellAppoint" calendar for each provider
2. **Event Management**: All appointment events go to the WellAppoint calendar
3. **Invite Management**: Add client emails to calendar events for notifications
4. **Sync Strategy**: Implement bidirectional sync between your system and Google Calendar

## Alternative Approaches

### For Distance Calculations
Consider using the Google Maps Distance Matrix API without OAuth:
- No authentication required for basic distance calculations
- More cost-effective for public location data
- Reduces OAuth complexity

### For Calendar Integration
Consider using webhook-based sync:
- Subscribe to calendar changes via webhooks
- Reduces API calls and improves real-time updates
- More efficient than polling

## Testing Strategy
1. **Development Environment**: Use test Google accounts
2. **Scope Testing**: Verify minimal scopes work for all operations
3. **Calendar Isolation**: Ensure no access to other calendars
4. **Token Management**: Test refresh and error handling
5. **Security Testing**: Verify data access limitations

## Compliance Notes
- Ensure compliance with Google's OAuth 2.0 policies
- Implement proper data handling for GDPR/CCPA if applicable
- Document data usage and retention policies
- Provide clear privacy notices for OAuth permissions

## Next Steps
1. Set up Google Cloud Project with required APIs
2. Implement OAuth flows for providers and clients
3. Create calendar management system
4. Implement secure token storage
5. Test all integrations thoroughly
6. Deploy with proper security measures
