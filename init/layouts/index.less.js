exports.layoutsLess = `html,body{
    padding: 0;
    margin: 0;
}
.navs {
  ul {
    padding: 0;
    list-style: none;
    display: flex;
  }
  li {
    margin-right: 1em;
  }
}
.ant-layout {
    .header-main{
        height: 64px;
        padding-inline: 20px;
        background-color: #fff;
        .nav-top{
            float: left;
            width: 180px;
            overflow: hidden;
            .nav-logo{
                font-size: 16px;
                font-weight: bold;
                img{
                    height: 32px;
                    margin: 16px 7px 0 0;
                }
            }
        }
        .nav-breadcrumb{
            display: inline-block;
            margin-left: 10px;
            line-height: 64px;
        }
        .personal-info{
            float: right;
            height: 64px;
            display: flex;
            cursor: pointer;
            .personal-img{
                width: 40px;
                height: 40px;
                border-radius: 40px;
                overflow: hidden;
                margin: 15px 20px 0 0;
                img{
                    max-width: 40px;
                    min-height: 40px;
                }
            }
            .personal-summary{
                line-height: 20px;
                margin-top: 12px;
                margin-right: 20px;
            }
        }
    }
    .content-main{
        min-height: 120px;
        margin: 16px;
    }
    .sider-main{
        background-color: #f5f5f5;
    }
}
.common-table{
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
}`