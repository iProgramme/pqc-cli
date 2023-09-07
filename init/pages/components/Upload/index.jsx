import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import './index.less'
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
const Index = (props) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(props.img);
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                    borderRadius: '100px',
                }}
            >
                上传图片
            </div>
        </div>
    );
    return (
        <Upload
            name="img"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action="http://192.168.31.79:3000/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}

        >
            {imageUrl ? (
                <div style={{
                    backgroundImage: `url(${imageUrl}) `,
                }} className='upload-picture'>
                    +
                </div>
            ) : (
                uploadButton
            )}
        </Upload>
    );
}

export default Index
