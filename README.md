# Next.js App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## ⚙️ Environment Setup

1. In the project root, you’ll find a file named:

   ```
   .env.example
   ```
2. Rename it to:

   ```
   .env.local
   ```
3. Update the variables inside. For local development, make sure to set:

   ```ini
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

---

## 🚀 Running with Docker Compose

This project includes a `Dockerfile` and `docker-compose.yml` for containerized development.

### 1. Build & Start Services


#### Development Mode

>  This project includes a `docker-compose.yml` for running the app in **development mode** with hot reload.

```bash
docker-compose up --build
```

### 2. Access the App

Open [http://localhost:3000](http://localhost:3000/) in your browser.

### 3. Stop Services

```bash
docker-compose down
```

### 4. Logs

```bash
docker-compose logs -f
```

---

## ▶️ Running Locally (Without Docker)

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000/) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
