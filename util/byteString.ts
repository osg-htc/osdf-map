export function toByteString(bytes: number): string {
    const units = ["Byte(s)", "Kilobyte(s)", "Megabyte(s)", "Gigabyte(s)", "Terabyte(s)", "Petabyte(s)", "Exabyte(s)"];
    let index = 0;
    let value = bytes;

    while (value >= 1000 && index < units.length - 1) {
        value /= 1000;
        index++;
    }

    return `${parseFloat(value.toFixed(2))} ${units[index]}`;
}

export default toByteString;