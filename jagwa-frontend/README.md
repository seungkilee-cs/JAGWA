# JAGWA - Just Another Generic Weather App

A beautiful, responsive weather application built with Svelte, TypeScript, and Vite. Features temperature unit conversion, air quality monitoring, UV index tracking, and detailed weather forecasts.

## Features

- 🌡️ **Temperature Conversion**: Seamlessly switch between Celsius and Fahrenheit
- 🌍 **Global Weather**: Search for weather in any city worldwide
- 📊 **Detailed Forecasts**: 5-day daily forecasts with hourly precipitation data
- 🌬️ **Air Quality Index**: Real-time AQI monitoring with health recommendations
- ☀️ **UV Index**: UV exposure levels with safety guidelines
- 📱 **Responsive Design**: Beautiful iPad-like interface that works on all devices
- 🎨 **Modern UI**: Glassmorphism design with smooth animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jagwa-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your OpenWeatherMap API key:
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Copy `.env.example` to `.env`
   - Add your API key to the `.env` file:
     ```
     VITE_WEATHER_API_KEY=your_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Mock Data Mode

The app includes comprehensive mock data for development and testing. If no API key is provided, the app will automatically use mock data featuring Seoul weather information.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript and Svelte checks

## API Integration

The app uses the OpenWeatherMap API for:
- Current weather conditions
- 5-day/3-hour forecasts
- Air Quality Index
- UV Index data

## Architecture

- **Frontend**: Svelte 5 with TypeScript
- **Build Tool**: Vite
- **Charts**: Chart.js for precipitation visualization
- **State Management**: Svelte stores
- **Styling**: Component-scoped CSS with modern design patterns

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and checks
5. Submit a pull request

## License

This project is licensed under the MIT License.