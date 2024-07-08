export function Grid({ children, className, cols, rows, gap }: {
    children: React.ReactElement<any, any> | React.ReactElement<any, any>[] | string,
    className?: string,
    cols?: number,
    rows?: number,
    gap?: number | { x: number, y: number }
}) {
    return <div className={
        `grid grid-flow-row ${cols != undefined ? `grid-cols-${cols}` : ""}${rows != undefined ? ` grid-rows-${rows}` : ""}${typeof gap == "number" ? ` gap-${gap}` : ""}${typeof gap != "number" ? ` gap-x-${gap?.x} gap-y-${gap?.y}` : ""}${className != undefined ? " " + className : ""}`
    }>
        {children}
    </div>
}

export function GridElement({ children, className, pos }: {
    children?: React.ReactElement<any, any> | React.ReactElement<any, any>[] | string | string[],
    className?: string,
    pos?: { width: number, height: number, row: number, column: number }
}) {
    return <div className={
        `${className ?? ""}`
    } style={pos != undefined ? { gridRow: `${pos.row + 1} / ${pos.row + 1 + pos.height}`, gridColumn: `${pos.column + 1} / ${pos.column + 1 + pos.width}` } : {}}>
        {children}
    </div>
}