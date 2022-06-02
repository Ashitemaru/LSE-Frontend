interface URLParseResult {
    status: number, // 0 - success, other - failure
    result: Record<string, string>,
}

const parseURLParam = (urlSearch: string): URLParseResult => {
    if (urlSearch[0] !== "?") {
        return {
            status: -1,
            result: {},
        };
    }

    const param: Record<string, string> = {};
    urlSearch
        .substring(1)
        .split("&")
        .forEach((s: string) => {
            const [key, val] = s.split("=");
            param[key] = val;
        });
    return {
        status: 0,
        result: param,
    };
};

export type { URLParseResult };
export { parseURLParam };