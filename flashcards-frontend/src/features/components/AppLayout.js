import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Layout } from 'antd';
import AdminMenu from '../admin/AdminMenu';

const { Content, Header, Footer } = Layout;

const AppLayout = (props) => {
    const navigate = useNavigate();

    const gotoHome = () => {
        navigate('/');
    };

    return (
        <div className='app-layout-container'>
            <Layout className='app-layout'>
                <Header className='app-layout-header'>
                    <Flex align='center' justify='space-between'>
                        <div className='app-title' onClick={gotoHome}>
                            Korean Flashcards (한국어 플래시 카드)
                        </div>
                        <AdminMenu />
                    </Flex>
                </Header>
                <Content>
                    <div className='app-layout-content-container'>
                        {props.children}
                    </div>
                </Content>
                <Footer className='app-layout-footer'>
                    Bryan Ogden ©{new Date().getFullYear()}.
                </Footer>
            </Layout>
        </div>
    );
};

export default AppLayout;
