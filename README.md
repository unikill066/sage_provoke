# S.A.G.E — Strategic Analysis & Guidance Engine

A modern, professional multi-agent workflow app built with **React**, **Vite**, **Tailwind CSS**, and **shadcn/ui**.

## Features

- 🧠 Multi-step, multi-agent workflow (Strategy → Biz Reqs → Design & UX → Features → User Stories)
- 💡 Each step offers AI-generated choices with confidence levels and color-coded badges
- ✍️ Users can refine requirements at any step with custom input
- 🟢 Modern, animated, glassmorphic UI with vibrant green/teal theme
- 🖥️ Fully responsive, enterprise-grade design
- ⚡ Built with Vite, React, Tailwind CSS, and shadcn/ui

## Getting Started

1. **Install dependencies:**
   ```bash
   cd sage-frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   ```
   http://localhost:5173
   ```

## Project Structure

```
sage_provoke/
└── sage-frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   └── components/
    ├── public/
    ├── package.json
    └── ...
```

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS, shadcn/ui, custom glassmorphism
- **State:** React hooks
- **No backend required** (all logic is frontend)

## Customization

- **Agents & Steps:** Edit the `agents` array in `App.jsx`
- **Theme:** Tweak colors in `src/index.css`
- **UI Components:** Use shadcn/ui for rapid, modern component development

## License

MIT
