const webpush = require('web-push')
const { json } = require('micro')

// web-push will use VAPID keys from environment variables
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:you@example.com'
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.warn('VAPID keys not set. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in env.');
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method Not Allowed')
    return
  }

  try {
    const body = await json(req)
    // Expect body { subscription: {...}, payload: {...} }
    const subscription = body.subscription
    const payload = body.payload || { title: 'Portal RT', body: 'Notifikasi baru', url: '/' }

    if (!subscription || !subscription.endpoint) {
      res.statusCode = 400
      res.end(JSON.stringify({ ok: false, error: 'Invalid subscription' }))
      return
    }

    await webpush.sendNotification(subscription, JSON.stringify(payload))
    res.statusCode = 200
    res.end(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error('send error', err)
    res.statusCode = 500
    res.end(JSON.stringify({ ok: false, error: err.message }))
  }
}
