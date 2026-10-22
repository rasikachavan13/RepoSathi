# RepoSathi AI

**Open source, made approachable.**

RepoSathi AI helps new contributors understand a project, identify a realistic first contribution, and turn that idea into a practical action plan. It uses a locally running Gemma model through Ollama.

## Graphify

<img width="1557" height="860" alt="image" src="https://github.com/user-attachments/assets/aafaca2f-201e-44b8-aaea-ed49c56d4822" />


## Features

- Paste a README, issue description, or code snippet.
- Choose beginner, intermediate, or advanced guidance.
- Get a plain-language summary, contribution idea, where-to-look guidance, steps, testing checklist, PR draft, and cautions.
- Copy individual sections or the whole result.
- Local model inference through Ollama; no GitHub token is required.
- Request validation, input size limits, API error handling, timeout handling, and JSON output validation.

## Requirements

- Node.js 18 or newer (Node 20 LTS recommended)
- npm
- [Ollama](https://ollama.com/) installed and running
- A Gemma model already downloaded in Ollama

## Setup on Windows

### 1. Unzip and open the project

Extract the ZIP file. In VS Code, choose **File → Open Folder** and select the `reposathi-ai` folder.

### 2. Install JavaScript dependencies

Open **Terminal → New Terminal** in VS Code and run:

```powershell
npm install
```

### 3. Configure Ollama

Check which models are already installed:

```powershell
ollama list
```

Copy the exact model tag shown in the `NAME` column. Create a `.env` file in the project root by copying `.env.example`, then set `GEMMA_MODEL` to that exact tag.

Example only:

```env
PORT=3000
OLLAMA_BASE_URL=http://127.0.0.1:11434
GEMMA_MODEL=gemma3:4b
FRONTEND_ORIGIN=http://localhost:5173
OLLAMA_TIMEOUT_MS=120000
```

`gemma3:4b` is only an example. Use a model you have actually installed. If the event requires Gemma 4 specifically, verify that your Ollama version supports the desired Gemma 4 model and install it before the event; don't assume this example is Gemma 4.

If Ollama is not installed, install it from https://ollama.com/ and pull an appropriate Gemma model before using the app. Model downloads can be large, so do this ahead of a live event.

### 4. Start the backend

In terminal 1:

```powershell
npm run server
```

You should see a message that the backend is listening on `http://localhost:3000`.

Check `http://localhost:3000/api/health` in your browser.

### 5. Start the frontend

Open a second VS Code terminal (**Terminal → New Terminal**) and run:

```powershell
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

Keep both terminals open while using the app.

## Quick test

1. Click **Try a sample project**.
2. Choose an experience level.
3. Click **Build my contribution map**.
4. Check that the result sections appear.

## Troubleshooting

- **`npm` is not recognized:** install Node.js LTS from https://nodejs.org/, restart VS Code, and try again.
- **Backend not connected:** make sure `npm run server` is running and visit `http://localhost:3000/api/health`.
- **Could not connect to Ollama:** start the Ollama application and confirm its local service is running.
- **Model may not be installed:** run `ollama list` and copy an exact model tag into `.env`.
- **Model takes too long:** try shorter text or increase `OLLAMA_TIMEOUT_MS`.
- **Port is already in use:** stop the other app using port 3000 or change `PORT` in `.env`.

## Project structure

```text
reposathi-ai/
├── src/
│   ├── services/api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── server/
│   ├── services/gemmaService.js
│   ├── services/promptBuilder.js
│   ├── utils/validation.js
│   └── index.js
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Safety and limitations

- Treat AI output as a starting point, not truth. Verify suggestions against the actual repository and contribution guidelines.
- Do not paste API keys, passwords, private source code, or personal information.
- RepoSathi does not clone repositories, inspect files that were not supplied, run code, or create pull requests automatically.
- The server does not intentionally log the supplied text, but local machine and model runtime security still matter.

## License

MIT — see [LICENSE](LICENSE).
