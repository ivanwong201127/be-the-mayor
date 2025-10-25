# Be The Mayor

A modern Next.js application featuring an interactive map of America with major cities. Users can explore cities, filter by regions, and see detailed information about each city.

## Features

- 🗺️ **Interactive America Map**: Explore major US cities with click-to-select functionality
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

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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
│   │   ├── globals.css          # Global styles with Tailwind
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Home page with map
│   └── components/
│       ├── america-map.tsx      # Interactive map component
│       └── map-data.ts          # City data and USA outline
├── tailwind.config.js           # Tailwind configuration
├── package.json
└── README.md
```

## Map Features

### City Selection
- Click on any city dot to select/deselect it
- Selected cities show with green color and pulsing animation
- Unselected cities appear as red dots
- Hover effects provide visual feedback

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

### Adding New Cities
Edit `src/components/map-data.ts` to add new cities:

```typescript
{
  id: 'city-name',
  name: 'City Name',
  state: 'State',
  population: 1000000,
  coordinates: [x, y], // SVG coordinates
  region: 'Northeast' // or 'South', 'Midwest', 'West'
}
```

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