import React, { SetStateAction } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';

const PopConfirm= ({description,title,HandleClose}:{description:string,title:string,HandleClose:React.Dispatch<SetStateAction<boolean>>}) => (
  <Popconfirm
    title={title}
    description={description}
    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
    onConfirm={()=>{
        console.log("confirm");
        HandleClose(state=>!state);
    }}
    onCancel={()=>{
        console.log("cancel");
        HandleClose(state=>!state);
    }}
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);

export default PopConfirm;