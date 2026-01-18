# 快乐学汉字

一个帮助小朋友学习中文汉字的趣味网页应用。

## 功能特点

- **拼音练习**：输入汉字后，可以查看拼音并自己练习输入
- **组词造句**：显示每个汉字的常见组词和例句
- **听音选字**：点击喇叭听发音，选择正确的汉字

## 本地运行

直接用浏览器打开 `index.html` 文件即可。

## 部署到 GitHub Pages

### 方法一：使用 GitHub 网页界面

1. 在 GitHub 上创建一个新的仓库
   - 访问 https://github.com/new
   - 仓库名称随意填写，例如 `learn-chinese`
   - 设置为 Public（公开）
   - 不要勾选 "Add a README file"
   - 点击 "Create repository"

2. 上传文件
   - 点击 "uploading an existing file"
   - 拖拽 `index.html` 文件到页面
   - 在 "Commit changes" 处填写提交信息
   - 点击 "Commit changes"

3. 启用 GitHub Pages
   - 进入仓库的 Settings（设置）
   - 在左侧菜单找到 "Pages"
   - 在 "Source" 下选择 "Deploy from a branch"
   - 分支选择 "main" 或 "master"，文件夹选择 "/ (root)"
   - 点击 "Save"

4. 等待几分钟，你的网站就会在以下地址发布：
   ```
   https://你的用户名.github.io/learn-chinese/
   ```

### 方法二：使用 Git 命令行

如果你安装了 Git，可以用命令行操作：

```bash
# 初始化 Git 仓库
git init

# 添加文件
git add index.html

# 提交
git commit -m "Initial commit"

# 在 GitHub 上创建仓库后，执行以下命令（替换为你的地址）
git branch -M main
git remote add origin https://github.com/你的用户名/learn-chinese.git
git push -u origin main
```

然后在 GitHub 仓库设置中启用 Pages 功能（同方法一第3步）。

## 使用说明

1. 在输入框中输入想要学习的汉字（如：山水花鸟）
2. 切换不同的标签页进行练习：
   - **拼音练习**：点击汉字可以听发音，在输入框中练习写拼音
   - **组词造句**：查看常用词语和例句，点击词语可以朗读
   - **听音选字**：点击大喇叭听音，选择正确的汉字

## 浏览器兼容性

建议使用现代浏览器：
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

## 注意事项

- 听音功能需要浏览器支持 Web Speech API
- 建议在电脑或平板上使用，体验更好
- 可以随时添加更多汉字到数据库中

---

用心陪伴孩子的每一次学习
