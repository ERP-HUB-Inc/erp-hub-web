import React from "react";
import { Col, Card, Statistic } from "antd";
import { Translate } from "@redux/index";

const StatisticCard = ({
    locale,
    value = 0,
    color = "3f8600",
    precision = 2,
    colSpan = { xs: 24, sm: 24, md: 12, lg: 8, xl: 4 },
    suffix = "",
    style = {},
}) => {
    return (
        <Col {...colSpan} style={{ marginBottom: 16, ...style }}>
            <Card>
                <Statistic
                    title={<Translate id={locale} />}
                    value={value ?? 0}
                    valueStyle={{ color }}
                    precision={precision}
                    suffix={suffix}
                />
            </Card>
        </Col>
    );
};

export {
    StatisticCard
};
