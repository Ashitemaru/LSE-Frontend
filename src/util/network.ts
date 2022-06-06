import AbortController from "abort-controller";
import { USER_AGENT } from "../constants/strings";

const uFetch = async (
    url: string,
    param: Record<string, string | undefined>,
    postBody?: object,
    timeout?: number, // In miliseconds
) => {
    // Initialize timeout controller
    const controller = new AbortController();
    const timeoutEvent = setTimeout(() => {
        controller.abort();
    }, timeout || 60000);

    // Construct fetch parameters
    const defaultInit = {
        headers: {
            "User-Agent": USER_AGENT,
            "Content-Type": "application/json",
        },
        signal: controller.signal,
        method: postBody === undefined ? "GET" : "POST",
        mode: "cors",
    };
    const init = postBody === undefined ? defaultInit : {
        ...defaultInit,
        body: JSON.stringify(postBody),
    };

    // Concat the URL
    const serializedParam =
        Object.keys(param)
            .filter((key: string) => param[key] !== undefined)
            .map((key: string) => key + "=" + param[key])
            .join("&");
    const paramedURL = url + (serializedParam === "" ? "" : "?" + serializedParam);

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const respose = await fetch(paramedURL, init);

        if (respose.status !== 200 && respose.status !== 201) {
            // TODO: Handle it
        }

        return await respose.json();

    } finally {
        clearTimeout(timeoutEvent);
    }
};

export { uFetch };