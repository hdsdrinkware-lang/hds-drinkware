import { execFileSync } from "node:child_process";

const siteOrigin = "https://www.hdsdrinkware.com";
const key = process.env.INDEXNOW_KEY;
const beforeSha = process.env.BEFORE_SHA;
const currentSha = process.env.CURRENT_SHA || "HEAD";

if (!key) {
  throw new Error("INDEXNOW_KEY is required.");
}

const isAllZeros = beforeSha && /^0+$/.test(beforeSha);
const gitArgs = isAllZeros || !beforeSha
  ? ["show", "--pretty=", "--name-only", currentSha]
  : ["diff", "--name-only", `${beforeSha}..${currentSha}`];

const changedFiles = execFileSync("git", gitArgs, { encoding: "utf8" })
  .split("\n")
  .map((file) => file.trim())
  .filter(Boolean);

const pageUrlForFile = (file) => {
  if (file === "index.html") return `${siteOrigin}/`;
  if (file.endsWith("/index.html")) {
    return `${siteOrigin}/${file.slice(0, -"/index.html".length)}/`;
  }
  if (file.endsWith(".html")) return `${siteOrigin}/${file}`;
  return null;
};

const urlList = [...new Set(changedFiles.map(pageUrlForFile).filter(Boolean))];

if (urlList.length === 0) {
  console.log("No public HTML page changes to submit to IndexNow.");
  process.exit(0);
}

const keyLocation = `${siteOrigin}/${key}.txt`;
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let keyIsLive = false;

for (let attempt = 1; attempt <= 18; attempt += 1) {
  try {
    const keyResponse = await fetch(`${keyLocation}?check=${Date.now()}`, {
      headers: { "cache-control": "no-cache" },
    });
    const keyBody = keyResponse.ok ? (await keyResponse.text()).trim() : "";
    if (keyBody === key) {
      keyIsLive = true;
      break;
    }
  } catch {
    // GitHub Pages may still be publishing the verification file.
  }

  console.log(`Waiting for IndexNow key deployment (${attempt}/18)...`);
  await wait(10_000);
}

if (!keyIsLive) {
  throw new Error(`IndexNow key was not published at ${keyLocation}.`);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "www.hdsdrinkware.com",
    key,
    keyLocation,
    urlList,
  }),
});

if (!response.ok) {
  const responseBody = await response.text();
  throw new Error(`IndexNow returned ${response.status}: ${responseBody}`);
}

console.log(`Submitted ${urlList.length} changed page(s) to IndexNow.`);
urlList.forEach((url) => console.log(url));
