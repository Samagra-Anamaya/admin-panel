import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import styles from './index.module.scss';
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CircularProgress,
} from "@mui/material";
import {
    Form,
    required,
    useTranslate,
    useLogin,
    useNotify,
    useTheme,
} from "react-admin";
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";

const Login = () => {
    const [applicationId, setApplicationId] = useState<string>("");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = (e: any) => {
        // will call authProvider.login({ email, password })
        login({ username, password, applicationId }).catch(() =>
            notify('Invalid email or password')
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginVector} style={{ backgroundImage: 'url(loginBg.avif)', backgroundSize: 'cover' }}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoImages}>
                        {/* <img src={'/hpLogo.png'} />
                        <img src={'/samarthLogo.png'} />
                        <img src={'/ssaLogo.png'} /> */}
                    </div>
                    <p>STRIDE Odisha</p>
                    <p>Admin Management Panel</p>
                </div>
            </div>
            <div className={styles.loginContainer} >
                <Form onSubmit={handleSubmit} noValidate>
                    <Card className={styles.loginCard} sx={{ borderRadius: 2, padding: '3rem 0rem', background: 'none', boxShadow: 'none' }}>
                        <div className={styles.cardHeader}>
                            Login
                        </div>
                        {!applicationId && <>
                            <div className={styles.adminTypeContainer}>
                                <h4>Select Admin Type</h4>
                                <Button variant="contained" sx={{ padding: '0.7em' }} onClick={() => setApplicationId(import.meta.env.VITE_ANAMAYA_APPLICATION_ID)}>Admin 1</Button>
                                <Button variant="contained" sx={{ padding: '0.7em' }} onClick={() => setApplicationId(import.meta.env.VITE_SCHEME_APPLICATION_ID)}>Admin 2</Button>
                            </div>
                        </>}

                        {applicationId && <> <Box>
                            <Box sx={{ marginTop: "2em" }}>
                                <TextField
                                    autoFocus
                                    label={'Username'}
                                    required
                                    fullWidth
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ marginTop: "1em" }}>
                                <TextField
                                    label={'Password'}
                                    required
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    variant="outlined"
                                    type={'password'}
                                />
                            </Box>
                        </Box>
                            <CardActions sx={{ padding: "3em 1em 1em 1em" }}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    fullWidth
                                    sx={{ background: "#2855b5", padding: '0.7rem', marginTop: -2 }}
                                    onMouseEnter={(e: any) => e.target.style.background = "#1c3a7a"}
                                    onMouseLeave={(e: any) => e.target.style.background = "#2855b5"}
                                >
                                    Login
                                </Button>
                            </CardActions>
                        </>}
                    </Card>
                </Form>
            </div>

        </div >

    );
};

Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

export default Login;

interface FormValues {
    username?: string;
    password?: string;
}
