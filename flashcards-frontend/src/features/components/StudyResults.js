import React from 'react';
import { Alert, Flex } from 'antd';

const StudyResults = ({ correct, incorrect, total }) => {
    const successPercentage = ((correct / total) * 100).toFixed(2);
    const errorPercentage = ((incorrect / total) * 100).toFixed(2);
    return (
        <>
            <Flex gap='small'>
                <Alert
                    message={`${successPercentage}%`}
                    type='success'
                    showIcon
                    style={{ width: '50%' }}
                />
                <Alert
                    message={`${errorPercentage}%`}
                    type='error'
                    showIcon
                    style={{ width: '50%' }}
                />
            </Flex>
        </>
    );
};
export default StudyResults;
