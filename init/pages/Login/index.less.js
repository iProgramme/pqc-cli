exports.loginLess = `.login-main{
    position: relative;
    .bg-image{
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        z-index: -1;
    }
    .logo{
        position: absolute;
        top: 88px;
        left: 20%;
        img{
            width: 130px;
        }
    }
    .login{
        position: absolute;
        top: 150px;
        left: 20%;
        width: 430px;
        background-color: #fff;
        padding: 40px 50px;
        .title{
            font-size: 20px;
            font-weight: bold;
            position: relative;
            span{
                position: absolute;
                bottom: -10px;
                left: 0;
                height: 4px;
                width: 40px;
                background-color: #1677FF;
                border-radius: 10px;
            }
        }
        .login-form{
            padding-top: 30px;
            .login-form-button{
                width: 100%;
            }
            .test-code{
                width: 100px;
                height: 40px;
            }
            .ant-tabs-nav::before{
                border: 0!important;
            }
            .ant-tabs-nav-wrap {
                display: flex;
                justify-content: center;
            }
            .ant-input-affix-wrapper{
                border-radius: 4px;
                background: #F5F5F5;
                input {
                    padding-left: 18px;
                    background: #F5F5F5;
                }
            }
            .ant-input-affix-wrapper:hover,
            .ant-input-affix-wrapper.ant-input-affix-wrapper-focused {
                background: #fff;
                input {
                    padding-left: 18px;
                    background: #fff;
                }
            }
            .bar {
                width: 1px;
                height: 24px;
                background: #DCDFE6;
            }
            .forget-code {
                position: absolute;
                right: 0;
                top: 0;
                transform: rotateY(-50%);
                color: #C0C4CC;
                cursor: pointer;
            }
        }
    }
}`