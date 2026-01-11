# Toolio
**A Privacy-First, Local-First File Processing Suite**

Toolio is a powerful web application designed to handle everyday file operations—image compression, video trimming, PDF merging, and audio conversion—with a strict focus on user privacy. Unlike cloud-based tools that store your data, Toolio processes everything temporarily using your server's local binaries, ensuring your files never leave your control.

##  Features

- **Image Tools**: Compress generic images, convert images to PDF.
- **Video Tools**: Trim videos, extract audio tracks.
- **Audio Tools**: Convert between formats (MP3, WAV, OGG, FLAC, M4A).
- **PDF Tools**: Merge multiple PDFs into one.
- **Privacy Core**: No database, no tracking, auto-wiping of temporary files.

---

## Architecture

Toolio follows a **Monorepo** architecture split into a modern Frontend and a Microservices Backend.

```
/
├── frontend/             # React + Vite + Tailwind CSS Application
└── toolio-backend/       # Bun.js Monorepo
    ├── apps/
    │   ├── image-service/ # Handles ImageMagick operations (Port 4001)
    │   ├── pdf-service/   # Handles Ghostscript operations (Port 4002)
    │   └── video-service/ # Handles FFmpeg operations (Port 4003)
    └── packages/
        └── core/          # Shared library for safety & utilities
```

---

## Tech Stack & Libraries

### Frontend (`/frontend`)
Built with performance and aesthetics in mind.
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `tailwind-merge` & `clsx`.
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI).
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth transitions.
- **Icons**: [Lucide React](https://lucide.dev/).
- **Routing**: `react-router-dom`.
- **State/Fetching**: `@tanstack/react-query`.

### Backend (`/toolio-backend`)
Built for raw speed using [Bun](https://bun.sh/).
- **Runtime**: Bun.js (native TypeScript support, fast startup).
- **Workspace Manager**: Bun Workspaces.
- **Binaries**:
    - **ImageMagick** (`magick` on Windows, `convert` on Linux)
    - **FFmpeg** & **FFprobe**
    - **Ghostscript** (`gswin64c` on Windows, `gs` on Linux)

---

## Privacy & The `Core` Library

Privacy is not just a feature; it's the architecture. We do not use a database. We do not persist files.

### The `@toolio/core` Library (`packages/core`)
This shared package is the guardian of the backend. Every service uses it to ensure:

1.  **Isolated Job Directories (`tempDir.ts`)**:
    - Every request generates a UUID.
    - Files are stored in `os.tmpdir()/toolio/<service>/<uuid>/`.
    - **Security**: Path traversal attacks are blocked by strict path normalization checks.

2.  **Safe Execution (`runCommand.ts`)**:
    - Wraps bun's `spawn` to run external commands (FFmpeg, etc.).
    - **Timeouts**: Enforces a strict 30-second limit on all operations to prevent indefinite hanging.
    - **Error Handling**: Captures `stderr` and exit codes for robust debugging.

3.  **Auto-Cleanup / Garbage Collection (`cleanup.ts`)**:
    - A background "Cron" job runs every 10 minutes.
    - It scans the temporary directory and strictly deletes folders older than 30 minutes.
    - This ensures that even if a server crashes before finishing a request, the disk never fills up.

4.  **Validation (`validateFile.ts`)**:
    - Enforces file size limits (e.g., 500MB for video, 50MB for images).
    - Validates MIME types to prevent malicious file uploads.

---

## Getting Started

### Prerequisites
- **Bun**: Install [Bun](https://bun.sh/).
- **Binaries**: Ensure `ffmpeg`, `magick` (ImageMagick v7+), and `ghostscript` are in your system PATH.

### 1. Start the Backend
You need to start each microservice. In the `toolio-backend` folder:

```bash
# Install dependencies
bun install

# Start Image Service (Port 4001)
bun apps/image-service/src/index.ts

# Start PDF Service (Port 4002)
bun apps/pdf-service/src/index.ts

# Start Video Service (Port 4003)
bun apps/video-service/src/index.ts
```

### 2. Start the Frontend
In the `frontend` folder:

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```

The app will launch at `http://localhost:5173`.

---

## License
MIT License. Open source and free to use.
