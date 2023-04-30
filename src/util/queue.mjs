export const wrap = map => {
    const queue = {
        size: () => map.size,
        isEmpty: () => queue.size() === 0,
        peek: () => {
            if (queue.isEmpty()) return null;
            for (const entry of map) return entry;
        },
        poll: () => {
            if (queue.isEmpty()) return null;
            const entry = queue.peek();
            map.delete(entry[0]);
            return entry;
        },
    };

    return queue;
};
