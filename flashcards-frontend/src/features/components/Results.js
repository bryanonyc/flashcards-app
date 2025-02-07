import { Result } from 'antd'

export const NOT_FOUND_404 = () => {
    return (
        <div className='center-content'>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you requested does not exist."
            />
        </div>
    )
}

export const ENVIRONMENT_NOT_SETUP_WARNING = () => {
    return (
        <div className='center-content'>
            <Result
                status="error"
                title="Missing Environment Variable"
                subTitle="A required environment variable is missing.  Please set either API_ENDPOINT_BASE_URL or REACT_APP_API_ENDPOINT_BASE_URL"
            />
        </div>
    )
}
