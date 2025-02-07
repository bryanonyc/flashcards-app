import React from 'react';
import { Alert } from 'antd';

const StudyResults = ({ correct, incorrect, total }) => {
    const successPercentage = ((correct / total) * 100).toFixed(2);
    const errorPercentage = ((incorrect / total) * 100).toFixed(2);
    return (
        <>
            <Alert
                message={`Success Percent: ${successPercentage}%`}
                type='success'
                showIcon
            />
            <Alert
                message={`Error Percent: ${errorPercentage}%`}
                type='error'
                showIcon
            />
        </>
    );
};
export default StudyResults;
