export default splitAtDelimiters;
declare function splitAtDelimiters(text: any, delimiters: any): ({
    type: string;
    data: any;
    rawData?: undefined;
    display?: undefined;
} | {
    type: string;
    data: any;
    rawData: any;
    display: any;
})[];
