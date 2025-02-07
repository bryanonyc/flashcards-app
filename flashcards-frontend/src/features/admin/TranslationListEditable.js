import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ENGLISH_TERMS } from '../../graphql/queries';
import { Button, Form, Input, Table } from 'antd';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className='editable-cell-value-wrap'
                style={{
                    paddingInlineEnd: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const TranslationListEditable = () => {
    const { data, loading, error } = useQuery(GET_ENGLISH_TERMS);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Sort in descending order
    const sortedData = [...data.englishTerms].sort((a, b) => b.id - a.id);

    const defaultColumns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            hidden: true,
        },
        {
            title: 'English Term',
            dataIndex: 'term',
            key: 'term',
            editable: true,
            sorter: (a, b) => a.term.localeCompare(b.term),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: '',
            dataIndex: 'korean_id',
            key: 'korean_id',
            hidden: true,
        },
        {
            title: 'Korean Term',
            dataIndex: ['korean', 'term'],
            key: ['korean', 'term'],
            editable: true,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type='link' href={`/translations/${record.id}/edit`}>
                    Edit
                </Button>
            ),
        },
    ];

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                // handleSave,
            }),
        };
    });

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    return (
        <div>
            {data && (
                <Table
                    size='small'
                    components={components}
                    columns={columns}
                    dataSource={sortedData}
                    rowClassName={() => 'editable-row'}
                    bordered
                />
            )}
        </div>
    );
};

export default TranslationListEditable;
