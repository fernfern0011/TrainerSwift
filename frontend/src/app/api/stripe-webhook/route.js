export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Make a request to your webhook endpoint on port 8000
            const webhookResponse = await fetch('http://localhost:5000/api/stripe/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body), // Pass the request body to the webhook
            });

            // Check if the webhook request was successful
            if (webhookResponse.ok) {
                // If successful, return a success response
                res.status(200).json({ success: true });
            } else {
                // If not successful, return an error response
                res.status(500).json({ error: 'Error forwarding webhook' });
            }
        } catch (error) {
            console.error('Error forwarding webhook:', error);
            res.status(500).json({ error: 'Error forwarding webhook' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
