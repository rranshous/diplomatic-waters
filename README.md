# Diplomatic Waters

A browser-based treaty writing simulator powered by AI.

![Diplomatic Waters Logo](https://via.placeholder.com/800x400?text=Diplomatic+Waters)

## Overview

Diplomatic Waters is an innovative game that puts players in the role of diplomatic mediators drafting treaties between nations during a water crisis. Unlike traditional games with hard-coded rules, this simulation uses AI to analyze treaty language and simulate how nations interpret, implement, and potentially exploit legal ambiguities.

### The Crisis

Three nations share the Nerin River basin during an unprecedented drought:

- **Tuvana** (upstream): Recently built a major dam for hydroelectric power
- **Alaria** (midstream): Agricultural economy heavily dependent on river irrigation
- **Meridian** (downstream): Mix of urban centers and farming communities

As water levels drop to critical levels, you must craft treaties that balance competing interests while preventing humanitarian disaster.

## Key Features

- **Treaty Drafting**: Write the actual text of treaties between nations
- **AI Analysis**: Claude AI analyzes legal language for loopholes and ambiguities
- **National Responses**: Receive feedback from each nation based on their interests
- **Diplomatic Correspondence**: Exchange messages with nation representatives
- **Dynamic Simulation**: Watch how your treaty affects the region through news updates
- **Treaty Revision**: Address emerging issues by revising treaty language

## Technical Implementation

Diplomatic Waters uses a minimalist approach that leverages AI for most game logic:

- **Frontend**: Single HTML file with embedded JavaScript and CSS
- **Backend**: Simple Express/TypeScript server acting as a proxy to the Anthropic API
- **Game Engine**: Claude AI model analyzes treaties, generates responses, and simulates outcomes

## Installation Requirements

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Anthropic API key (for Claude)

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/diplomatic-waters.git
cd diplomatic-waters
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the project root:

```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
```

4. **Build the TypeScript server**

```bash
npm run build
```

5. **Start the server**

```bash
npm start
```

6. **Access the game**

Open your browser and navigate to:
```
http://localhost:3000
```

## Game Flow

1. **Introduction**: Learn about the water crisis and nations involved
2. **Treaty Drafting**: Write a treaty addressing water allocation issues
3. **Nation Responses**: Receive feedback from each nation
4. **Correspondence**: Exchange messages to clarify positions
5. **Simulation**: Watch news updates showing treaty implementation
6. **Revision**: Address issues by revising treaty language

## Using Your Own API Key

Players can either:
- Use the server's Anthropic API key (set in `.env`)
- Input their own API key in the game interface

## Project Architecture

```
diplomatic-waters/
├── public/                # Static assets
│   └── index.html         # Main game interface (HTML/CSS/JS)
├── src/                   # TypeScript source files
│   └── server.ts          # Backend server implementation
├── docs/                  # Documentation
│   └── system-prompts.md  # AI system prompts documentation
├── examples/              # Example responses
│   ├── nation-response-example.json
│   └── news-example.json
├── .env                   # Environment variables (not in repo)
├── .env.example           # Template for environment variables
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## AI as Game Engine

What makes Diplomatic Waters unique is its use of AI as the core game engine. Rather than hard-coding rules about how treaties work, the game leverages Claude AI to:

1. **Analyze Treaty Language**: Identifying ambiguities, loopholes, and potential issues
2. **Simulate Nation Responses**: Generating realistic diplomatic feedback based on national interests
3. **Create Dynamic Outcomes**: Producing plausible consequences of treaty implementation

This approach creates a deeply responsive simulation that reacts to the nuances of legal language and diplomatic communication.

## Development

Run the development server with:

```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
