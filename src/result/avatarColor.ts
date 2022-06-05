import { Md5 } from "ts-md5";

const colorList: string[] = [
    "#16A085",
    "#27AE60",
    "#2980B9",
    "#8E44AD",
    "#2C3E50",
    "#F39C12",
    "#D35400",
    "#C0392B",
    "#BDC3C7",
    "#7F8C8D",
];

const getBackgroundColor = (text: string): string => {
    return colorList[parseInt(Md5.hashStr(text), 16) % colorList.length];
};

export { getBackgroundColor };