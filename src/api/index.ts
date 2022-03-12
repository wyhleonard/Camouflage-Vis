// const ipAddress = "10.11.16.22";
const ipAddress = "127.0.0.1";
const port = "2333";
const baseUrl = "http://" + ipAddress + ":" + port + "/"

export const baseGetRequest = async (url: string) => {
    const res = await fetch(baseUrl + url, {
        method: "GET",
        mode: 'cors',
        headers: {
            'content-type': 'application/json'
        },
    });
    return res.json();
}

export const basePostRequest = async (url: string, data: any) => {
    const res = await fetch(baseUrl + url, {
        method: "POST",
        mode: 'cors',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

export const fetchInitData = async () => {
    return await baseGetRequest("fetch_init_data");
}

export const fetchCcoreStatistics = async () => {
    return await baseGetRequest("fetch_score_statistics");
}

export const fetchConnectSubgraph = async (data: any) => {
    return await basePostRequest("fetch_connect_subgraph", data);
}

export const fetchSubgraphData = async (data: any) => {
    return await basePostRequest("fetch_subgraph_data", data);
}

export const fetchCommunityMatrix = async (data: any) => {
    return await basePostRequest("fetch_community_matrix", data);
}

export const fetchNodesRelation = async (data: any) => {
    return await basePostRequest("fetch_nodes_relation", data);
}
