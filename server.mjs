import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { AsyncLocalStorage } from "node:async_hooks";
import express from "express";
import { createRequestHandler } from "@react-router/express";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createDevServer() {
  const vite = await import("vite");
  return vite.createServer({
    root: __dirname,
    configFile: resolve(__dirname, "./vite.config.ts"),
    server: {
      middlewareMode: true,
      hmr: { host: "localhost", port: 10001 },
    },
  });
}

function handleIgnoredAssets(req, res, next) {
  const ignoreAssets = ["/service-worker.js"];

  if (ignoreAssets.includes(req.path)) {
    return res.status(404).end();
  }
  next();
}

const mode = process.env.NODE_ENV;
const port = process.env.PORT ?? (mode === "production" ? 3000 : 5173);

const app = express();

const devServer = mode !== "production" ? await createDevServer() : undefined;

const handleClientAssets = devServer
  ? devServer.middlewares
  : express.static(resolve(__dirname, "./build/client"));

const handleSSR = createRequestHandler({
  build: devServer
    ? () => devServer.ssrLoadModule("virtual:react-router/server-build")
    : await import("./build/server/index.js"),
});

const contextStorage = new AsyncLocalStorage();
globalThis.__getRequestLocalStorage__ = () => contextStorage.getStore();

app.all("*", handleClientAssets, handleIgnoredAssets, (req, res, next) => {
  contextStorage.run(new Map(), () => handleSSR(req, res, next));
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
