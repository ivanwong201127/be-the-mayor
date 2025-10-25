# Be The Mayor

A modern Next.js application featuring AI-powered campaign material generation. Users can create personalized avatars, generate political campaign posters and videos in various styles, and explore an interactive map of America with major cities.

## Features

- 🎭 **AI Avatar Generation**: Create personalized avatars using Replicate's AI models
- 🗺️ **Interactive America Map**: Explore major US cities with click-to-select functionality
- 🎨 **Campaign Poster Creation**: Generate political campaign posters in various styles
- 🏛️ **Multiple Campaign Styles**: Choose from Communist, Republican, Liberal, Anime, Vintage, and Cyberpunk
- 🏙️ **City-Specific Campaigns**: Each city has unique slogans, issues, and cultural elements
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS
- 📱 **Responsive Design**: Works perfectly on all screen sizes
- 🎯 **City Selection**: Click cities to select/deselect with visual feedback
- 🌍 **Region Filtering**: Filter cities by Northeast, South, Midwest, and West regions
- 📊 **City Information**: View population data and city details
- ⚡ **Fast Performance**: Built with Next.js 16 and Turbopack

## Tech Stack

- **Next.js 16** - React framework with Turbopack
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - Latest React features

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd be-the-mayor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
REPLICATE_API_KEY=your_replicate_api_key_here
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
be-the-mayor/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-avatar/
│   │   │   │   └── route.ts         # Avatar generation API endpoint
│   │   │   └── generate-campaign-poster/
│   │   │       └── route.ts         # Campaign poster generation API endpoint
│   │   ├── globals.css              # Global styles with Tailwind
│   │   ├── layout.tsx               # Root layout component
│   │   └── page.tsx                 # Home page with avatar and poster generation
│   ├── components/
│   │   └── america-map.tsx          # Interactive map component
│   ├── constants/
│   │   └── campaign.ts              # Campaign styles and city data
│   └── types/
│       └── index.ts                 # TypeScript type definitions
├── tailwind.config.js               # Tailwind configuration
├── package.json
└── README.md
```

## Campaign Poster Features

### Campaign Styles
Choose from six different campaign poster styles:
- **Communist**: Red and gold theme with socialist imagery
- **Republican**: Conservative blue theme with patriotic imagery
- **Liberal**: Progressive theme with inclusive messaging
- **Anime**: Japanese anime style with vibrant colors
- **Vintage**: Retro 1950s American campaign style
- **Cyberpunk**: Futuristic neon theme with tech elements

### City-Specific Campaigns
Each major city has unique campaign elements:
- **New York**: "The City That Never Sleeps" - housing, transportation, diversity
- **Los Angeles**: "City of Angels" - homelessness, traffic, entertainment industry
- **Chicago**: "The Windy City" - public safety, education, architecture
- **Houston**: "Space City" - flooding, energy transition, NASA
- **Phoenix**: "Valley of the Sun" - water scarcity, desert culture, solar energy

### How It Works
1. **Describe Yourself**: Enter a detailed description of yourself
2. **Choose Style**: Select your preferred campaign poster style
3. **Select City**: Click on a city from the interactive map
4. **Generate Poster**: Create your personalized campaign poster

## Map Features

### City Selection
- Click on any city dot to select/deselect it
- Selected cities show with green color and pulsing animation
- Unselected cities appear as red dots
- Hover effects provide visual feedback
- Selected cities are used for campaign poster generation

### Region Filtering
- Filter cities by geographic regions:
  - **Northeast**: New York, Boston, Philadelphia, etc.
  - **South**: Houston, Atlanta, Miami, etc.
  - **Midwest**: Chicago, Detroit, Minneapolis, etc.
  - **West**: Los Angeles, San Francisco, Seattle, etc.

### City Information
- View population data for each city
- See city names and state information
- Quick stats showing total cities and selected count

## Customization

### Adding New Campaign Styles
Edit `src/constants/campaign.ts` to add new campaign styles:

```typescript
{
  id: 'style-name',
  name: 'Style Name',
  description: 'Style description',
  promptTemplate: 'Create a {style} campaign poster featuring {description}...',
  colorScheme: 'blue-600'
}
```

### Adding New Cities
Edit `src/constants/campaign.ts` to add new cities with campaign data:

```typescript
'City Name': {
  cityName: 'City Name',
  state: 'State',
  slogan: 'City Slogan',
  localIssues: ['issue1', 'issue2'],
  culturalElements: ['element1', 'element2']
}
```

### Customizing Prompts
Modify the `promptTemplate` in campaign styles to customize how posters are generated. Use placeholders like:
- `{description}` - User's self-description
- `{city}` - Selected city name
- `{state}` - City's state
- `{slogan}` - City's campaign slogan

### Styling
The application uses Tailwind CSS with custom configurations in `tailwind.config.js`. You can:
- Modify colors in the theme
- Add custom animations
- Extend the design system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).