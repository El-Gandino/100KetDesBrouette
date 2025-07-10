# Mobile Location App

## Overview
The Mobile Location App is designed to track the user's location and send updates every 5 minutes. It ensures that location data is recorded and retransmitted in case of transmission failures. This application is compatible with devices such as the Nothing Phone 1 and Fairphone 6.

## Features
- Tracks user location every 5 minutes.
- Handles location updates and manages transmission failures.
- Saves location data locally when transmission fails.
- User-friendly interface for easy interaction.

## Project Structure
```
mobile-location-app
├── src
│   ├── App.js
│   ├── components
│   │   └── LocationTracker.js
│   ├── services
│   │   └── LocationService.js
│   └── utils
│       └── StorageHelper.js
├── package.json
├── .babelrc
├── .eslintrc.js
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mobile-location-app.git
   ```
2. Navigate to the project directory:
   ```
   cd mobile-location-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```
   ```
   npm install react@^19.0.0 react-dom@^19.0.0
   ```

## Usage
1. Start the application:
   ```
   npm start
   ```
2. Grant location permissions when prompted.
3. The app will begin tracking your location and sending updates every 5 minutes.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.