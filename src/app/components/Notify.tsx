import { SmileOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { useEffect } from 'react';

export default function Notify({description,message}:{description:string,message:string}) {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
      api.open({
        message: message,
        description:description,
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        duration:2000
      });
    };
    useEffect(()=>openNotification(),[description,message])
    return (
      <>
        {contextHolder}
      </>
    );
  
}
