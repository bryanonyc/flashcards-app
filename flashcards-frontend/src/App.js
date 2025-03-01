import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CardHome from './features/cards/CardHome';
import AppLayout from './features/components/AppLayout';
import Welcome from './features/components/Welcome';
import { NOT_FOUND_404 } from './features/components/Results';
import TranslationList from './features/admin/TranslationList';
import Login from './features/auth/Login';
import ValidateAuthorization from './features/auth/ValidateAuthorization';
import { useTitle } from './features/hooks/useTitle';

function App() {
    useTitle('Korean Flashcards');

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    index
                    element={
                        <AppLayout>
                            <Welcome />
                        </AppLayout>
                    }
                />

                <Route
                    path='/cards'
                    element={
                        <AppLayout>
                            <CardHome />
                        </AppLayout>
                    }
                />

                <Route
                    element={
                        <AppLayout>
                            <ValidateAuthorization />
                        </AppLayout>
                    }
                >
                    <Route path='/translations' element={<TranslationList />} />
                </Route>

                <Route
                    path='/login'
                    element={
                        <AppLayout>
                            <Login />
                        </AppLayout>
                    }
                />

                <Route
                    path='*'
                    element={
                        <AppLayout>
                            <NOT_FOUND_404 />
                        </AppLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
