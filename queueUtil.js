
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
        toMap: procedure => {
            const map = new Map();
            while (!queue.isEmpty()) {
                const [key, value] = queue.poll();
                map.set(key, procedure ? procedure(value) : value);
            }
            return map;
        },
        pipe: procedure => newQueueFromMap(queue.toMap(procedure)),
    };

    return queue;
};
