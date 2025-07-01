# S.A.G.E — Strategic Analysis & Guidance Engine

A modern, professional multi-agent workflow app built with **React**, **Vite**, **Tailwind CSS**, **shadcn/ui**, and **FastAPI**.

![sage](https://github.com/user-attachments/assets/71d90656-ac4c-409c-a165-9a7b2b5cbbaa)

> Note: It is a swarm of 13 crews, decoupled for processing Human-in-the-loop requests and versioning runs.
>
> [Tools: Search(Tavily, Serper, DallETool for image generation]


### Execution
![sage-asset-git](https://github.com/user-attachments/assets/9c15ff68-7b64-4078-b8ca-5bb12b848d65)


## Features

- 🧠 Multi-step, multi-agent workflow (Strategy → Biz Reqs → Design & UX → Features → User Stories)
- 💡 Each step offers AI-generated choices with confidence levels and color-coded badges
- ✍️ Users can refine requirements at any step with custom input
- 🟢 Modern, animated, glassmorphic UI with vibrant green/teal theme
- 🖥️ Fully responsive, enterprise-grade design
- ⚡ Built with Vite, React, Tailwind CSS, and shadcn/ui
- 🔗 FastAPI backend with OpenAI integration
- 📋 Jira integration for user story management

## Getting Started

### Backend Setup

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   JIRA_BOARD_URL=your_jira_board_url
   JIRA_PROJECT_KEY=your_project_key
   JIRA_API_TOKEN=your_jira_api_token
   JIRA_EMAIL=your_jira_email
   ```

4. **Start the backend server:**
   ```bash
   python3 src/server.py
   ```
   The backend will run on `http://localhost:8000`

### Frontend Setup

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
├── src/
│   ├── server.py              # FastAPI backend server
│   ├── crew.py                # Multi-agent workflow logic
│   ├── agents/                # Agent implementations
│   ├── prompts/               # AI prompts
│   └── utils/                 # Backend utilities
├── sage-frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom React hooks
│   │   └── utils/             # Frontend utilities
│   ├── public/
│   └── package.json
├── requirements.txt           # Python dependencies
└── .env                      # Environment variables (create this)
```

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, shadcn/ui
- **Backend:** FastAPI, Python
- **AI:** OpenAI API
- **Integration:** Jira REST API
- **State:** React hooks
- **Styling:** Custom glassmorphism design

## Customization

- **Agents & Steps:** Edit the workflow in `src/crew.py`
- **AI Prompts:** Modify prompts in `src/prompts/`
- **Theme:** Tweak colors in `sage-frontend/src/index.css`
- **UI Components:** Use shadcn/ui for rapid, modern component development

## License

MIT
