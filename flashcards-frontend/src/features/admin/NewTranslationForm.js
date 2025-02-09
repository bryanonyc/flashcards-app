import { Button, Form, Input } from 'antd';

const NewTranslationForm = ({ closeModalFn, submitFn }) => {
    const [form] = Form.useForm();

    const resetAndCloseModal = () => {
        form.resetFields();
        closeModalFn();
    };

    const handleSubmit = async (values) => {
        submitFn(values);
        resetAndCloseModal();
    };

    return (
        <Form form={form} autoComplete='off' onFinish={handleSubmit}>
            <Form.Item
                label='English Term'
                name='english'
                rules={[
                    { required: true, message: 'English Term is required.' },
                ]}
            >
                <Input placeholder='English' />
            </Form.Item>
            <Form.Item
                label='Korean Term'
                name='korean'
                rules={[
                    { required: true, message: 'Korean Term is required.' },
                ]}
            >
                <Input placeholder='한극어' />
            </Form.Item>
            <div className='submit-button-container'>
                <Button type='primary' htmlType='submit'>
                    Submit
                </Button>
                <Button onClick={resetAndCloseModal}>Cancel</Button>
            </div>
        </Form>
    );
};

export default NewTranslationForm;
