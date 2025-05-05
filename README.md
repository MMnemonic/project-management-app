# Project Management App

A React Native application built with Expo that allows users to manage projects with robust offline support. This app was developed as a 4-hour technical assessment, demonstrating pragmatic engineering decisions under time constraints.

## Features

- View, create, and edit projects
- Each project has a name, status, and optional assignee
- Full offline support - use the app without an internet connection
- Changes automatically sync when back online
- Visual indicators for network status
- Manual sync option for edge cases

## Project Structure

```
project-management-app/
├── .expo/                # Expo configuration
├── assets/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── NetworkStatus.tsx  # Connectivity indicator
│   │   ├── ProjectCard.tsx    # Project list item
│   ├── contexts/         # React contexts
│   │   ├── ProjectsContext.tsx  # Projects state provider
│   ├── hooks/            # Custom hooks
│   │   ├── useNetworkStatus.ts  # Network connectivity
│   │   ├── useProjects.ts       # Project data & sync
│   ├── screens/          # Main app screens
│   │   ├── ProjectFormScreen.tsx  # Create/edit form
│   │   ├── ProjectListScreen.tsx  # List view
│   ├── api.ts            # API service with backend simulation
│   ├── storage.ts        # Storage utilities 
│   └── types.ts          # TypeScript type definitions
├── App.tsx               # Main application component
├── app.json              # Expo app configuration
├── package.json          # Dependencies
├── package-lock.json     # Lock file
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Technical Implementation

### Offline-First Approach

The app uses an offline-first approach with the following strategy:
1. All data is stored locally using AsyncStorage
2. Changes made while offline are added to a sync queue
3. When the device reconnects, changes are synchronized with the server
4. Verification is performed to ensure data consistency
5. UI provides clear indicators of sync status

### Sync Mechanism

The sync process includes several reliability features:
- Optimistic local updates for responsive UI
- Queue-based processing of offline changes
- Data verification after storage operations
- Background syncing with minimal user intervention
- Manual sync option for edge cases

### State Management

A custom hook (`useProjects`) manages the state of projects with:
- Local CRUD operations
- Optimistic updates for immediate feedback
- Background synchronization
- Network status integration
- Error handling with graceful fallbacks

## Design Decisions (4-Hour Constraint)

Several pragmatic choices were made due to the time constraint:

1. **Simple UI Components**: The status selector was kept inline rather than extracted to a separate component, as the current implementation is sufficiently simple.

2. **Minimal Animation**: While fade/slide animations would enhance the UX, they were noted as improvement opportunities rather than implemented in the initial version.

3. **In-memory Backend**: A simulated backend was implemented rather than connecting to a real database service, focusing effort on the offline sync logic.

4. **Focused Error Handling**: Error management prioritizes common user flows rather than exhaustive edge cases.

5. **Strategic Comments**: Intent-revealing comments were added to highlight design decisions and possible enhancements.

## Future Enhancements

Given more time, these improvements could be implemented:

1. **UI/UX Refinements**:
   - Animated transitions for network status indicators
   - Pull-to-refresh functionality
   - Enhanced empty state visualizations
   - Swipe actions for quick project operations

2. **Technical Improvements**:
   - Comprehensive unit/integration tests
   - More robust conflict resolution
   - Real backend integration
   - Project deletion with undo capability
   - Batch operations (multi-select and delete)

3. **Features**:
   - Project categories or tags
   - Due dates and priorities
   - User authentication
   - Collaborative editing
   - Project archiving for completed items

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run the app:
   ```
   npx expo start
   ```
   
3. For a clean start (clearing cache):
   ```
   npx expo start -c
   ```

## Tech Stack

- React Native with Expo
- TypeScript for type safety
- React Navigation (stack navigator)
- AsyncStorage for local data persistence
- NetInfo for network connectivity monitoring
- Custom hooks for state management
- Context API for global state
- Jest (test configuration ready) 