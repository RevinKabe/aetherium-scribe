# Aetherium Scribe

A visually stunning, illustrative web application for creating Dungeons & Dragons 5th Edition characters.

Aetherium Scribe is a visually captivating and intuitive web application designed to streamline the creation of Dungeons & Dragons 5th Edition characters. The application guides users through a seamless, step-by-step wizard, transforming the often complex process of character creation into an enjoyable and creative journey. Each step, from choosing a race and class to assigning ability scores and selecting a background, is presented in a beautifully designed, illustrative interface. The final output is a polished, digital character sheet that is both functional and aesthetically pleasing, embodying the spirit of fantasy and adventure.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/RevinKabe/aetherium-scribe)

## Key Features

*   **Intuitive Character Creation Wizard:** A guided, multi-step process for building your D&D 5e character.
*   **Comprehensive Steps:** Covers all core aspects of character creation including Race, Class, Ability Scores, and Background.
*   **Stunning Visuals:** An illustrative, fantasy-themed UI with a parchment-and-ink aesthetic.
*   **Interactive Selections:** Engaging card-based choices with smooth animations and hover effects.
*   **Digital Character Sheet:** Generates a beautifully formatted, read-only character sheet summarizing your creation.
*   **Client-Side State Management:** Uses Zustand for a fast and responsive experience without backend calls during creation.

## Technology Stack

*   **Frontend:** React, Vite, TypeScript
*   **UI:** Tailwind CSS, shadcn/ui, Framer Motion
*   **State Management:** Zustand
*   **Forms:** React Hook Form, Zod
*   **Backend:** Hono on Cloudflare Workers
*   **Storage:** Cloudflare Durable Objects

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later)
*   Bun (v1.0 or later)
*   A Cloudflare account and the Wrangler CLI installed globally:
    ```bash
    bun install -g wrangler
    ```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/aetherium-scribe.git
    cd aetherium-scribe
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Authenticate with Cloudflare:**
    ```bash
    wrangler login
    ```

## Development

To start the development server, which includes both the Vite frontend and the Hono backend worker, run:

```bash
bun run dev
```

This will start the application, typically on `http://localhost:3000`. The frontend will automatically reload on changes, and the worker will restart as needed.

### Project Structure

*   `src/`: Contains the React frontend application code.
    *   `pages/`: Top-level page components.
    *   `components/`: Reusable UI components.
    *   `store/`: Zustand state management stores.
    *   `lib/`: Utilities and helper functions.
*   `worker/`: Contains the Hono backend code for the Cloudflare Worker.
    *   `index.ts`: The main entry point for the worker.
    *   `user-routes.ts`: API route definitions.
    *   `core-utils.ts`: Durable Object helpers and core logic.
*   `shared/`: TypeScript types and data shared between the frontend and backend.

## Deployment

This project is configured for easy deployment to Cloudflare Pages.

1.  **Build the application:**
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    The `deploy` script in `package.json` handles both the build and deployment process.
    ```bash
    bun run deploy
    ```

Wrangler will guide you through the deployment process, publishing the static assets and the worker function to your Cloudflare account.

Alternatively, deploy directly from your GitHub repository:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/RevinKabe/aetherium-scribe)

## License

This project is licensed under the MIT License - see the LICENSE file for details.