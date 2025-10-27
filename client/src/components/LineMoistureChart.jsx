import { useMemo } from 'react'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'

function formatTick(ts, range) {
    try {
        const d = new Date(ts)
        if (isNaN(d)) return ts

        const base = { timeZone: 'Asia/Jakarta' }
        if (range === 'today') {
            return new Intl.DateTimeFormat('id-ID', {
                ...base,
                hour: '2-digit',
                minute: '2-digit',
            }).format(d)
        }
        return new Intl.DateTimeFormat('id-ID', {
            ...base,
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(d)
    } catch {
        return ts
    }
}

export default function LineMoistureChart({ logs = [], loading, range = 'today' }) {
    const data = useMemo(() => {
        return (Array.isArray(logs) ? logs : []).map((l) => {
            const t = l.createdAt ?? l.created_at
            const d = t ? new Date(t) : null
            return {
                time: d && !isNaN(d) ? d.toISOString() : t ?? '',
                moisture: Number(l.moisture_level),
            }
        })
    }, [logs])

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="mb-2 text-sm text-muted-foreground">Moisture Level</div>
            <div className="h-64 w-full">
                {loading ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">Loading…</div>
                ) : data.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">No data</div>
                ) : (
                    <ChartContainer>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={(v) => formatTick(v, range)}
                                    minTickGap={24}
                                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(v) => {
                                                const d = new Date(v)
                                                if (isNaN(d)) return String(v)
                                                return new Intl.DateTimeFormat('id-ID', {
                                                    timeZone: 'Asia/Jakarta',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                }).format(d)
                                            }}
                                            formatter={(value) => [`${value}%`, 'Moisture']}
                                        />
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="moisture"
                                    stroke="#000"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </div>
        </div>
    )
}
