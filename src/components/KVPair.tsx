import { Typography } from "antd";
import React from "react";

const { Paragraph, Text } = Typography;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KVPair = ({ k, v }: { k: string, v: any }) => (
    <Paragraph>
        <Text strong>{k}</Text>
        <Text>{" - "}</Text>
        {v}
    </Paragraph>
);

export default KVPair;