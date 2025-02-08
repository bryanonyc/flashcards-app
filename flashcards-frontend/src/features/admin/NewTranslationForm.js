import { App, Button, Form, Input } from 'antd';
import { CREATE_TRANSLATION } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { GET_ENGLISH_TERMS } from '../../graphql/queries';

const NewTranslationForm = ({ closeModalFn }) => {
    const { message: antdMessage } = App.useApp();
    const [createTranslation] = useMutation(CREATE_TRANSLATION, {
        refetchQueries: [GET_ENGLISH_TERMS],
    });

    const [form] = Form.useForm();

    const resetAndCloseModal = () => {
        form.resetFields();
        closeModalFn();
    };

    const handleSubmit = async (values) => {
        try {
            await createTranslation({
                variables: {
                    translationInput: {
                        englishTerm: values.english,
                        koreanTerm: values.korean,
                    },
                },
            });

            resetAndCloseModal();
            antdMessage.success('Create was successful', 3);
        } catch (error) {
            resetAndCloseModal();
            antdMessage.error(`Create Failed. ${error.message}`, 5);
        }
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
