import cloudscraper from "cloudscraper";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { regno, password } = req.body;
    if (!regno || !password) {
        return res.status(400).json({ error: "Missing credentials" });
    }

    try {
        const form = { i: regno, p: password };

        const response = await cloudscraper.post({
            uri: "https://lovelyprofessionaluniversity.codetantra.com/r/l/p",
            form: form,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://myclass.lpu.in",
                "Referer": "https://myclass.lpu.in/",
                "User-Agent": "Mozilla/5.0"
            },
            resolveWithFullResponse: true,
            simple: false,
            followAllRedirects: false
        });

        if (response.statusCode === 303) {
            // Grab cookies for session reuse
            const cookies = response.headers["set-cookie"] || [];
            return res.json({ success: true, cookies });
        } else {
            return res.json({ success: false, status: response.statusCode });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
