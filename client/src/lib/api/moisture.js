let bearerToken = import.meta.env.VITE_APIKEY || null

export function setToken(token) {
    bearerToken = token || null
}

function getBaseUrl() {
    const url = import.meta.env.VITE_API_BASE_URL || ''
    return url.replace(/\/$/, '')
}

function mapRangeToPath(range) {
    switch (range) {
        case 'today':
            return 'today'
        case '3d':
            return 'three-days'
        case '7d':
            return 'seven-days'
        case 'all':
            return 'all-days'
        default:
            throw new Error('Invalid range')
    }
}

export async function fetchLogs(range = 'today') {
    const path = mapRangeToPath(range)
    const base = getBaseUrl()
    const url = `${base}/api/moisture/logs/${path}`

    const headers = { 'Content-Type': 'application/json' }
    if (bearerToken) headers['Authorization'] = `Bearer ${bearerToken}`

    const res = await fetch(url, { headers })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`API ${res.status}: ${text}`)
    }
    const json = await res.json()
    return json.data
}

export async function fetchIoTStatus() {
    const base = getBaseUrl()
    const url = `${base}/api/moisture/logs/status`

    const headers = { 'Content-Type': 'application/json' }
    if (bearerToken) headers['Authorization'] = `Bearer ${bearerToken}`

    const res = await fetch(url, { headers })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`API ${res.status}: ${text}`)
    }
    const json = await res.json()
    return json.data
}
