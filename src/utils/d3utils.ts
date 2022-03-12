import * as d3 from 'd3';

const rgbToHex = (value: string) => {
    const O2HMap: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    const temp = parseInt(value);
    const high: number = Math.floor(temp / 16);
    const low: number = temp % 16;
    return O2HMap[high] + O2HMap[low];
}
export const getLinearColor = (value: number) => {
    const scaleLinear = d3.scaleLinear()
        .domain([0, 0.3, 0.6, 1])
        // @ts-ignore
        .range(['#85de74', '#ffed2b', '#eaa54b', '#e86666']);

    const rgbStr: string = scaleLinear(value).toString().replaceAll(" ", "");
    const [r, g, b] = rgbStr.replaceAll(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    const color = "#" + rgbToHex(r) + rgbToHex(g) + rgbToHex(b);
    return color;
};
