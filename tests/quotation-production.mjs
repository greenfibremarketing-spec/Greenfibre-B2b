import assert from "node:assert/strict";
import { createServer } from "node:net";
import { spawn, spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const cwd = fileURLToPath(new URL("..", import.meta.url));
const directory = path.join(cwd, "tmp", "pdfs");
await fs.mkdir(directory, { recursive: true });
const captured = [];
const sockets = new Set();
let rejectMail = false;
// SMTP stays on loopback. Even real-looking internal recipients never leave
// this process, and production credentials are replaced by fixture values.
const smtp = createServer((socket) => {
  sockets.add(socket);
  socket.on("close", () => sockets.delete(socket));
  socket.setEncoding("utf8");
  socket.write("220 localhost test SMTP\r\n");
  let input = "", inData = false, lines = [];
  socket.on("data", (chunk) => {
    input += chunk;
    while (input.includes("\r\n")) {
      const end = input.indexOf("\r\n");
      const line = input.slice(0, end);
      input = input.slice(end + 2);
      if (inData) {
        if (line === ".") { captured.push(lines.join("\r\n")); lines = []; inData = false; socket.write("250 Stored locally\r\n"); }
        else lines.push(line.startsWith("..") ? line.slice(1) : line);
      } else if (/^EHLO|^HELO/i.test(line)) socket.write("250-localhost\r\n250-AUTH PLAIN\r\n250 SIZE 10485760\r\n");
      else if (/^AUTH/i.test(line)) socket.write("235 Authenticated test session\r\n");
      else if (/^MAIL FROM/i.test(line) && rejectMail) socket.write("550 Simulated delivery failure\r\n");
      else if (/^DATA/i.test(line)) { inData = true; socket.write("354 End with dot\r\n"); }
      else if (/^QUIT/i.test(line)) socket.end("221 Goodbye\r\n");
      else socket.write("250 OK\r\n");
    }
  });
});
await new Promise((resolve) => smtp.listen(0, "127.0.0.1", resolve));
for (const route of ["enquiry", "quote/pdf"]) {
  const trace = JSON.parse(await fs.readFile(path.join(cwd, ".next/server/app/api", route, "route.js.nft.json"), "utf8"));
  for (const font of ["Helvetica.cjs", "HelveticaBold.cjs"]) assert.ok(trace.files.some((file) => file.replace(/\\/g, "/").endsWith(`/pdfkit/js/standard-fonts/${font}`)), `${route} deploy trace contains ${font}`);
}
const log = await fs.open(path.join(directory, "production-test.log"), "w");
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "3108"], {
  cwd, windowsHide: true, stdio: ["ignore", log.fd, log.fd],
  env: { ...process.env, NODE_ENV: "production", MONGODB_URI: "", SMTP_HOST: "127.0.0.1", SMTP_PORT: String(smtp.address().port), SMTP_USER: "fixture@example.invalid", SMTP_PASS: "test-only", SMTP_FROM: "fixture@example.invalid", SALES_EMAIL: "sales@example.invalid" }
});
const base = "http://localhost:3108";
const body = {
  name: "Attachment Test", company: "Test Company", email: "buyer@example.invalid", phone: "9876543210", city: "Noida", pin: "201306",
  items: [{ slug: "custom", name: "Test Rice Husk Bottle", colour: "Green", qty: 10, mrp: 1199, unit: "piece" }]
};
const pdfBody = {
  reference: "GF-PRODUCTION-PDF-TEST", client: body,
  items: [{ ...body.items[0], lineGross: 11990, lineDiscount: 1799, lineNet: 10191 }],
  totalGross: 11990, totalItemDiscount: 1799, netSubtotalBeforeBundle: 10191, estimatedTotal: 10191, estimatedGST: 1834, totalWithGST: 12025
};
const post = (url, data) => fetch(base + url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: AbortSignal.timeout(30000) });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) throw new Error("Production server exited early");
    try { await fetch(base + "/robots.txt", { signal: AbortSignal.timeout(1000) }); ready = true; break; } catch {}
    await delay(500);
  }
  assert.ok(ready);
  const download = await post("/api/quote/pdf", pdfBody);
  assert.equal(download.status, 200, await (download.status !== 200 ? download.text() : Promise.resolve("PDF generated")));
  assert.match(download.headers.get("content-type"), /application\/pdf/);
  const generated = Buffer.from(await download.arrayBuffer());
  assert.equal(generated.subarray(0, 5).toString(), "%PDF-");
  await fs.writeFile(path.join(directory, "quotation-attachment-check.pdf"), generated);
  const submitted = await post("/api/enquiry", body);
  const result = await submitted.json();
  assert.equal(submitted.status, 200, JSON.stringify(result));
  assert.equal(result.pdfGenerated, true);
  assert.equal(result.emailSent, true);
  assert.equal(captured.length, 2, "customer and internal emails captured locally");
  const attachments = captured.map((message) => {
    assert.match(message, /Content-Type: application\/pdf/);
    assert.match(message, /Content-Disposition: attachment;/);
    const pdfPart = message.slice(message.indexOf("Content-Type: application/pdf"));
    const encoded = pdfPart.split(/\r\n\r\n/)[1].split(/\r\n--/)[0].replace(/\s/g, "");
    const bytes = Buffer.from(encoded, "base64");
    assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
    assert.ok(bytes.subarray(-32).includes(Buffer.from("%%EOF")));
    return bytes;
  });
  assert.deepEqual(attachments[0], attachments[1]);
  rejectMail = true;
  const failedDelivery = await (await post("/api/enquiry", body)).json();
  assert.equal(failedDelivery.emailSent, false);
  assert.ok(failedDelivery.warning);
  console.log("Passed: production font packaging, PDF endpoint, both MIME attachments, identical attachment bytes, and SMTP failure reporting. No external email was sent.");
} catch (error) {
  console.error(await fs.readFile(path.join(directory, "production-test.log"), "utf8"));
  throw error;
} finally {
  if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
  else child.kill("SIGTERM");
  for (const socket of sockets) socket.destroy();
  smtp.close();
  await log.close();
}
