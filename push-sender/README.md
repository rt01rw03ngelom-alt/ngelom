# RT Push Sender (Serverless)

Simple Web Push sender using `web-push`. Designed to be deployed as a serverless function (Vercel, Railway, Render).

## Files

- `api/send.js` - Serverless endpoint that accepts `{ subscription, payload }` and sends a web push notification.
- `package.json` - project manifest.

## Generate VAPID keys

Recommended: use `web-push` locally.

```bash
# install web-push globally (or run npx)
npm install -g web-push
# generate keys
web-push generate-vapid-keys --json
```

Output example:

```json
{
  "publicKey":"BExxxxxxx...",
  "privateKey":"xxxxxxxxxx..."
}
```

- `publicKey` -> paste into `Index.html` as `VAPID_PUBLIC_KEY` value (client-side).
- `privateKey` -> set as `VAPID_PRIVATE_KEY` environment variable on your server (do NOT expose this publicly).

## Deploy to Render (recommended for easiest free setup)

1. Push this repository to GitHub.
2. Open Render dashboard: https://dashboard.render.com
3. Create a new **Web Service**.
4. Connect your GitHub repository and choose the `push-sender` folder as the deploy root.
5. Set the build command to:

```bash
npm install
```

6. Set the start command to:

```bash
npm start
```

7. Set Environment Variables:

- `VAPID_PUBLIC_KEY` = (value generated above)
- `VAPID_PRIVATE_KEY` = (value generated above)
- `VAPID_SUBJECT` = `mailto:you@example.com` (optional)

Render will give you a public URL for the sender endpoint, for example:

```text
https://your-app.onrender.com
```

Your Apps Script should call:

```js
https://your-app.onrender.com/api/send
```

---

## Deploy to Vercel (optional)

If you prefer Vercel, the existing project also supports it.

1. Install Vercel CLI and login:

```bash
npm i -g vercel
vercel login
```

2. From this project folder, deploy:

```bash
vercel
```

3. In Vercel Dashboard, set Environment Variables for the project:

- `VAPID_PUBLIC_KEY` = (value generated above)
- `VAPID_PRIVATE_KEY` = (value generated above)
- `VAPID_SUBJECT` = `mailto:you@example.com` (optional)

## Usage

To send a push to a subscription (example using `curl`):

```bash
curl -X POST https://your-vercel-app.vercel.app/api/send \
  -H "Content-Type: application/json" \
  -d '{"subscription": YOUR_SUBSCRIPTION_OBJECT, "payload": {"title":"Halo","body":"Pesan baru","url":"/galeri"}}'
```

`YOUR_SUBSCRIPTION_OBJECT` is the JSON you stored earlier from the client.

## Integrate with Apps Script

You can either:

- Let Apps Script call this endpoint for each subscription it loads from the `PushSubscriptions` sheet, or
- Let your server (Vercel) fetch the sheet via an Apps Script endpoint (`doPost`/`doGet`) that returns subscriptions, then the server broadcasts to all.

If you want, I can add an Apps Script endpoint that returns all subscriptions in JSON.

## Security

- Never expose the private VAPID key to the client or commit it to source control.
- Use HTTPS (Vercel provides HTTPS by default).

---
