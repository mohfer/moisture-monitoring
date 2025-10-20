import { Card, CardContent } from './ui/card'

export default function StatsCards({ stats, loading }) {
    const items = [
        { key: 'latest', label: 'Latest' },
        { key: 'average', label: 'Average' },
        { key: 'min', label: 'Min' },
        { key: 'max', label: 'Max' },
        { key: 'count', label: 'Count' },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {items.map(({ key, label }) => (
                <Card key={key}>
                    <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">{label}</div>
                        <div className="mt-2 text-2xl font-semibold">
                            {loading
                                ? '—'
                                : stats?.[key] != null
                                    ? key === 'count'
                                        ? stats[key].toLocaleString()
                                        : `${stats[key]}%`
                                    : '—'}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
