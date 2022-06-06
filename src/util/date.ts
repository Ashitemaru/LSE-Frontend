const parseCHNDate = (s: string): Date => {
    try {
        const [_y, x] = s.split("年");
        const [_m, xx] = x.split("月");
        const _d = xx.split("日")[0];

        let [y, m, d] = [_y, _m, _d].map((n) => parseInt(n, 10));

        y = Number.isNaN(y) ? 0 : y;
        m = Number.isNaN(m) ? 1 : m;
        d = Number.isNaN(d) ? 1 : d;
        
        if (y < 0) return new Date(0);
        if (m < 1 || m > 12) return new Date(0);
        if (d < 1 || d > 31) return new Date(0);

        return new Date(y, m - 1, d);
    } catch {
        return new Date(0);
    }
};

export { parseCHNDate };