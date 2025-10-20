
import { useEffect, useState } from 'react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './components/ui/select'
import LineMoistureChart from './components/LineMoistureChart'
import StatsCards from './components/StatsCards'
import { fetchLogs, setToken } from './lib/api/moisture'

function App() {
  const [range, setRange] = useState('today')
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const pollInterval = import.meta.env.VITE_POLL_INTERVAL_MS || 10000

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setToken(token)
  }, [])

  useEffect(() => {
    let active = true
    let inFlight = false

    const load = async (silent = false) => {
      if (inFlight) return
      inFlight = true
      if (!silent) setLoading(true)
      setError('')
      try {
        const data = await fetchLogs(range)
        if (active) {
          setLogs(data.logs || [])
          setStats(data.stats || null)
        }
      } catch (e) {
        if (active) {
          setError(e.message || 'Failed to fetch')
          if (!silent) {
            setLogs([])
            setStats(null)
          }
        }
      } finally {
        if (active && !silent) setLoading(false)
        inFlight = false
      }
    }

    load(false)
    const id = setInterval(() => load(true), pollInterval)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [range, pollInterval])

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Moisture Monitoring</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Range</span>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="3d">3 days</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="all">All days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <LineMoistureChart logs={logs} loading={loading} range={range} />

      <StatsCards stats={stats} loading={loading} />
    </div>
  )
}

export default App
