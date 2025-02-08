import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    App,
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Space,
    Table,
} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ENGLISH_TERMS } from '../../graphql/queries';
import {
    DELETE_TRANSLATION,
    UPDATE_ENGLISH_TERM,
    UPDATE_KOREAN_TERM,
} from '../../graphql/mutations';
import NewTranslationForm from './NewTranslationForm';

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
    columnKey,
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

    let originalValue;
    const toggleEdit = () => {
        setEditing(!editing);
        originalValue =
            columnKey === 'korean_term'
                ? record.korean['term']
                : record['term'];
        form.setFieldsValue({
            [columnKey]: originalValue,
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
                columnKey,
                originalValue,
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
                name={columnKey}
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
            <div className='editable-cell-value-wrap' onClick={toggleEdit}>
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const TranslationList = () => {
    const { message: antdMessage } = App.useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [updateEnglish] = useMutation(UPDATE_ENGLISH_TERM);

    const [updateKorean] = useMutation(UPDATE_KOREAN_TERM);

    const [deleteTranslation] = useMutation(DELETE_TRANSLATION, {
        refetchQueries: [GET_ENGLISH_TERMS],
    });

    const { data, loading, error } = useQuery(GET_ENGLISH_TERMS);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Transform data by adding a key property and then sort in descending order
    const sortedData = [...data.englishTerms]
        .map((r) => {
            return { key: r.id, ...r };
        })
        .sort((a, b) => b.id - a.id);

    const handleDelete = async (id) => {
        try {
            await deleteTranslation({
                variables: {
                    englishId: id,
                },
            });
            antdMessage.success('Delete was successful', 3);
        } catch (error) {
            antdMessage.error(`Delete Failed. ${error.message}`, 5);
        }
    };

    const defaultColumns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            hidden: true,
        },
        {
            title: <span className='column-header-cell'>English Term</span>,
            dataIndex: 'term',
            key: 'term',
            editable: true,
            sorter: (a, b) => a.term.localeCompare(b.term),
            sortDirections: ['descend', 'ascend'],
            width: '45%',
        },
        {
            title: '',
            dataIndex: 'korean_id',
            key: 'korean_id',
            hidden: true,
        },
        {
            title: <span className='column-header-cell'>Korean Term</span>,
            dataIndex: ['korean', 'term'],
            key: 'korean_term',
            editable: true,
            width: '45%',
        },
        {
            title: <span className='column-header-cell'>Action</span>,
            dataIndex: 'action',
            render: (_, record) => (
                <Popconfirm
                    title='Confirm Delete'
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Button type='link'>Delete</Button>
                </Popconfirm>
            ),
        },
    ];

    const handleSave = async (row) => {
        const originalValue = row.originalValue;
        let updatedValue = row.term;
        if (row.columnKey === 'korean_term') {
            updatedValue = row.korean_term;
        }

        if (originalValue !== updatedValue) {
            try {
                if (row.columnKey === 'korean_term') {
                    await updateKorean({
                        variables: {
                            koreanId: row.korean_id,
                            term: updatedValue,
                        },
                    });
                } else {
                    await updateEnglish({
                        variables: {
                            englishId: row.id,
                            term: updatedValue,
                        },
                    });
                }
                antdMessage.success('Update was successful', 3);
            } catch (error) {
                antdMessage.error(`Update Failed. ${error.message}`, 5);
            }
        }
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                columnKey: col.key,
                title: col.title,
                handleSave,
            }),
        };
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    return (
        <div>
            {data && (
                <>
                    <Space direction='vertical'>
                        <Button type='primary' onClick={showModal}>
                            New Translation
                        </Button>
                        <Table
                            size='small'
                            components={components}
                            columns={columns}
                            dataSource={sortedData}
                            rowClassName={() => 'editable-row'}
                            bordered
                            scroll={{ y: 500 }}
                            pagination={{
                                showSizeChanger: true,
                            }}
                        />
                    </Space>
                    <Modal
                        title='New Translation'
                        open={isModalOpen}
                        footer={null}
                    >
                        <NewTranslationForm closeModalFn={closeModal} />
                    </Modal>
                </>
            )}
        </div>
    );
};

export default TranslationList;
