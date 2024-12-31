# Forex Trading Journal

A web application for traders to track, analyze, and improve their trading performance. Built with React, TypeScript, and Supabase.

## Features

- 📊 Track trades with detailed information
- 📈 Analyze performance metrics
- 🧮 Built-in lot size calculator
- 📱 Responsive design for all devices
- 🔒 Secure authentication
- 📝 Add notes and follow-up on trades

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Supabase (Backend & Authentication)
- shadcn/ui Components
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 16+ - [Download](https://nodejs.org)
- npm (comes with Node.js)

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd forex-trading-journal
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

### Deploy on Vercel

The easiest way to deploy this application is using Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. [Import your project](https://vercel.com/new) into Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

Vercel will automatically detect that it's a Vite project and set up the build configuration for you.

### Other Deployment Options

You can also deploy to any platform that supports static site hosting:

1. Build the project:
```bash
npm run build
```

2. Deploy the contents of the `dist` directory to your hosting provider.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.