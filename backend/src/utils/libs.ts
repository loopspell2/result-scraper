
export function getList(batch: number): Array<string> {
    const list: Array<string> = [];
    for (let i = 1; i <= batch; i++) {
        list.push(`0834CS211${i.toString().padStart(3, '0')}`);
    }
    return list;
}