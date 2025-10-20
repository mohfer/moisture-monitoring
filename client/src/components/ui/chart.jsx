import { cn } from "../../lib/utils"
import { Tooltip as RechartsTooltip } from "recharts"

export function ChartContainer({ className, children }) {
    return (
        <div className={cn("relative h-full w-full", className)}>
            {children}
        </div>
    )
}

export function ChartTooltip(props) {
    return <RechartsTooltip {...props} />
}

export function ChartTooltipContent({ active, payload, label, labelFormatter, formatter }) {
    if (!active || !payload || payload.length === 0) return null
    const items = payload.map((item, idx) => {
        const value = formatter ? formatter(item.value, item.name, item) : [item.value, item.name]
        const [val, name] = Array.isArray(value) ? value : [value, item.name]
        return (
            <div key={idx} className="flex items-center justify-between gap-6 text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-medium">{val}</span>
            </div>
        )
    })
    const labelText = labelFormatter ? labelFormatter(label) : label
    return (
        <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
            {labelText && (
                <div className="mb-2 text-xs text-muted-foreground">{labelText}</div>
            )}
            <div className="space-y-1">
                {items}
            </div>
        </div>
    )
}
