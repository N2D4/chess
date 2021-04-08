export async function wait(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
