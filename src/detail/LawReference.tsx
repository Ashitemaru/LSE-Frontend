import { List, Typography } from "antd";
import React from "react";
import { Clause, Reference } from "../util/type";

const { Text, Paragraph } = Typography;

const LawReference = ({ refs }: { refs: Reference[] }) => (
    <List
        dataSource={refs}
        itemLayout="vertical"
        renderItem={(item: Reference) => (
            <List.Item>
                <Typography>
                    <Paragraph>
                        <Text mark>{item.name}</Text>
                    </Paragraph>
                    {(item.clauses ?? []).length ? (
                        <Paragraph>
                            <ul>
                                {item.clauses.map((clause: Clause, ind: number) => (
                                    <li key={ind}>
                                        <Text>
                                            <Text>{clause.t}</Text>
                                            {clause.k && <Text type="secondary">{` ${clause.k}`}</Text>}
                                            {clause.x && <Text type="secondary">{` ${clause.x}`}</Text>}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        </Paragraph>
                    ) : (
                        <Paragraph>
                            <Text type="secondary">{"无具体依据法条"}</Text>
                        </Paragraph>
                    )}
                </Typography>
            </List.Item>
        )}
    />
);

export default LawReference;