# 在同一台电脑添加多个git用户（如公司账户和个人账户，GitHub、gitlab、gitee账户）

1. 在用户目录下创建.ssh文件夹，并进入.ssh文件夹
2. 执行命令：ssh-keygen -t rsa -C "公司账户邮箱" -f "id_rsa_company"（为公司账户生成一对密钥,不加 -f 时要注意修改密钥名称）
3. 执行命令：ssh-keygen -t rsa -C "个人账户邮箱" -f "id_rsa_personal"（为个人账户生成一对密钥）
4. 在.ssh路径下创建文件config，并添加以下内容：
    ```
    # 公司账户
    Host company
    HostName github.com
    User company_name
    IdentityFile ~/.ssh/id_rsa_company
    PreferredAuthentications publickey

    # 个人账户
    Host personal
    HostName github.com
    User personal_name
    IdentityFile ~/.ssh/id_rsa_personal
    PreferredAuthentications publickey
    ```
    ```
    # 配置文件参数
    # Host Host可以看作是一个你要识别的模式，对识别的模式，进行配置对应的的主机名和ssh文件，相当于一个别名，远程仓库地址的域名别名它涵盖了下面一个段的配置，我们可以通过他来替代将要连接的服务器地址。这里可以使用任意字段或通配符。访问ssh的时候如果服务器地址能匹配上这里Host指定的值，则Host下面指定的HostName将被作为最终的服务器地址使用，并且将使用该Host字段下面配置的所有自定义配置来覆盖默认的/etc/ssh/ssh_config配置信息。
    # HostName 要登录主机的主机名,是真正连接的服务器地址
    # User 自定义的用户名
    # PreferredAuthentications 指定优先使用哪种方式验证，支持密码和秘钥验证方法： publickey,password,keyboard-interactive 
    # IdentityFile 指明上面User对应的identityFile路径，指定本次连接使用的密钥文件
    ```
5. 分别在公司和个人git账户中将生成的公司账户密钥和个人账户密钥的public key添加到仓库设置
6. 配置全局git用户和邮箱，该配置对该电脑配置的所有用户都生效
   ```
   git config --global user.name "company_name"
   git config --global user.email "company_email"
   ```
7. 验证配置是否成功
   ```
   ssh -T git@company (公司账户)
   ssh -T git@personal (个人账户)
   ```
   提示Are you sure you want to continue connecting (yes/no)?是否继续链接，输入yes后回车，如果能看到类似于Hi XXXX! You've successfully authenticated, but GitHub does not provide shell access.这样的提示，则表示ssh key配置成功！

8. 拉取项目
   ：
   ```
   git clone git@company:company_name/xxx.git （拉取公司账户，将company_name/xxx.git修改为项目地址，下同）
   git clone git@personal:personal_name/xxx.git （ 拉取个人账户）
   ```

9. 关联推送本地项目设置
   ```
   git remote add origin git@company:company_name/xxx.git（公司账户）
   git remote add origin git@personal:personal_name/xxx.git（个人账户）
   ```


