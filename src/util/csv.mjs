export const alignment = { L: Symbol('align-left'), R: Symbol('align-right') };

const pad = (string, width, align) =>
    align === alignment.R ? string.padStart(width) : string.padEnd(width);

export const format = (head, body, bodyAlignments) => {
    const widths = head.map((columnName, columnIndex) =>
        Math.max(columnName.length, ...body.map(row => row[columnIndex].length))
    );

    const paddedHead = head.map((columnName, columnIndex) =>
        pad(columnName, widths[columnIndex], alignment.L)
    );

    const paddedBody = body.map(row =>
        row.map((value, columnIndex) =>
            pad(value, widths[columnIndex], bodyAlignments?.[columnIndex])
        )
    );

    return (
        [paddedHead, ...paddedBody].map(row => row.join(',')).join('\n') + '\n'
    );
};
