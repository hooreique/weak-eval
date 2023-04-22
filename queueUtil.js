
export const newQueueFromMap = map => {
    const queue = {
        isEmpty: () => map.size === 0,
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
        toMap: manipulate => {
            const newMap = new Map();
            while (!queue.isEmpty()) {
                const [key, value] = queue.poll();
                newMap.set(key, manipulate ? manipulate(value) : value);
            }
            return newMap;
        },
        pipe: manipulate => newQueueFromMap(queue.toMap(manipulate)),
    };

    return queue;
};
