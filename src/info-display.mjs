const isEmpty = info => !info || Object.keys(info).length === 0;

export default info => {
    if (isEmpty(info)) return ['\x1b[90m%s', 'Info not available'];

    const formats = [];
    const args = [];
    for (const key in info) {
        formats.push('\x1b[0m%s\x1b[90m: \x1b[33m%s\n');
        args.push(`${key}`);
        args.push(`${info[key]}`);
    }
    formats.push('\x1b[0m');

    const formatted = [];
    formatted.push(formats.join(''));
    args.forEach(arg => formatted.push(arg));

    return formatted;
};
