import './App.css';

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ConfirmationPage from './pages/ConfirmationPage';
import HomeFeedPage from './pages/HomeFeedPage';
import MessageGroupPage from './pages/MessageGroupPage';
import MessageGroupsPage from './pages/MessageGroupsPage';
import NotificationsFeedPage from './pages/NotificationsFeedPage';
import RecoverPage from './pages/RecoverPage';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import UserFeedPage from './pages/UserFeedPage';

import { Amplify } from 'aws-amplify';

Amplify.configure({
	AWS_PROJECT_REGION: 'us-east-1',
	aws_cognito_region: 'us-east-1',
	aws_user_pools_id: 'us-east-1_H1522aI5Y',
	aws_user_pools_web_client_id: '66b2401hh8frak6nteouj2ea6l',
	oauth: {},
	Auth: {
		// We are not using an Identity Pool
		// identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID, // REQUIRED - Amazon Cognito Identity Pool ID
		region: 'us-east-1', // REQUIRED - Amazon Cognito Region
		userPoolId: 'us-east-1_H1522aI5Y', // OPTIONAL - Amazon Cognito User Pool ID
		userPoolWebClientId: '66b2401hh8frak6nteouj2ea6l', // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
	},
});

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeFeedPage />,
	},
	{
		path: '/notifications',
		element: <NotificationsFeedPage />,
	},
	{
		path: '/@:handle',
		element: <UserFeedPage />,
	},
	{
		path: '/messages',
		element: <MessageGroupsPage />,
	},
	{
		path: '/messages/@:handle',
		element: <MessageGroupPage />,
	},
	{
		path: '/signup',
		element: <SignupPage />,
	},
	{
		path: '/signin',
		element: <SigninPage />,
	},
	{
		path: '/confirm',
		element: <ConfirmationPage />,
	},
	{
		path: '/forgot',
		element: <RecoverPage />,
	},
]);

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
