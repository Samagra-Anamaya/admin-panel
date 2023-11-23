import { Layout } from 'react-admin';
import { MyAppBar } from '../app-bar';
import { FC } from 'react';



export const MyLayout:FC<{props:any}> = props => <Layout {...props} appBar={MyAppBar} />;