# 快乐学汉字 - 项目编码规范

## 项目概述

单文件 HTML 应用，使用原生 JavaScript 实现的汉字学习工具，支持：
- 拼音学习
- 练习本
- 听音选字游戏
- 错字集管理
- 学习统计
- 跨设备云同步（Supabase Auth + AES 加密）

## 代码结构

```
index.html
├── CSS (内联 <style>)
├── HTML 结构
└── JavaScript (内联 <script>)
    ├── 数据存储变量
    ├── Supabase 云同步模块
    ├── 核心学习功能
    └── UI 更新函数
```

## 编码规范

### 1. 函数定义

**优先使用 `function` 关键字声明**，提升可读性：
```javascript
// ✅ 推荐
function saveUserData(userId, pin) {
    // ...
}

// ❌ 避免（除非用于回调）
const saveUserData = (userId, pin) => {
    // ...
};
```

### 2. 变量命名

| 类型 | 命名风格 | 示例 |
|------|---------|------|
| 常量 | `UPPER_SNAKE_CASE` | `SUPABASE_URL`, `MAX_PIN_LENGTH` |
| 局部变量 | `camelCase` | `currentUser`, `syncTimeout` |
| 函数 | `camelCase` 动词开头 | `saveUserData()`, `updateLoginUI()` |
| 布尔值 | `is/has/can` 前缀 | `isLoggedIn`, `hasSyncData` |

### 3. 错误处理

**优先使用显式错误检查，避免深层嵌套的 try/catch**：

```javascript
// ✅ 推荐：提前返回
async function saveUserData(userId, pin) {
    if (!supabaseClient) {
        throw new Error('Supabase 未配置');
    }
    if (!pin) {
        throw new Error('PIN 码不能为空');
    }

    const { error } = await supabaseClient
        .from('user_learning_data')
        .upsert({ user_id: userId, encrypted_data: encrypted });

    if (error) {
        throw new Error(`保存失败: ${error.message}`);
    }
}

// ❌ 避免：过度嵌套
async function saveUserData(userId, pin) {
    try {
        if (supabaseClient) {
            if (pin) {
                // ... 更多嵌套
            }
        }
    } catch (e) {
        // ...
    }
}
```

### 4. 条件判断

**使用 if/else 链，避免嵌套三元运算符**：

```javascript
// ✅ 推荐
function getSyncStatus(status) {
    if (status === 'synced') {
        return '已同步';
    } else if (status === 'syncing') {
        return '同步中...';
    } else if (status === 'error') {
        return '同步失败';
    }
    return '未同步';
}

// ❌ 避免：嵌套三元
function getSyncStatus(status) {
    return status === 'synced' ? '已同步'
        : status === 'syncing' ? '同步中...'
        : status === 'error' ? '同步失败'
        : '未同步';
}
```

### 5. 函数组织

**按功能分组，保持相关函数靠近**：

```javascript
// ========== 云同步模块 ==========
// Supabase 客户端初始化
// 认证函数
// 数据加密/解密
// 数据同步

// ========== 核心学习功能 ==========
// 拼音学习
// 练习本
// 听音选字游戏

// ========== UI 更新函数 ==========
// 拼音区域更新
// 练习区域更新
// 错字集更新
```

### 6. 注释规范

**有用的注释**：
- 标注模块边界（如 `// ========== 云同步模块 ==========`）
- 解释复杂业务逻辑
- 标注临时解决方案（需要修复）

**不必要的注释**（删除）：
- 描述显而易见的代码
- 重复函数名

```javascript
// ✅ 有用
// 使用轮询确保 Supabase SDK 加载完成
function initSupabase() { ... }

// ❌ 无用
// 定义保存函数
function saveMistakes() { ... }
```

### 7. DOM 操作

**缓存 DOM 查询，避免重复选择**：

```javascript
// ✅ 推荐
const charInput = document.getElementById('charInput');
const pinyinContent = document.getElementById('pinyin-content');

function updatePinyinSection() {
    pinyinContent.innerHTML = generateHtml();
}

// ❌ 避免
function updatePinyinSection() {
    document.getElementById('pinyin-content').innerHTML = ...;
}
```

### 8. 异步操作

**async/await 优先于 Promise 链**：

```javascript
// ✅ 推荐
async function handleLogin() {
    try {
        const result = await authenticateWithPin(pin);
        currentUser = result.user;
        updateLoginUI();
    } catch (error) {
        showError(error.message);
    }
}

// ❌ 避免
function handleLogin() {
    authenticateWithPin(pin)
        .then(result => {
            currentUser = result.user;
            updateLoginUI();
        })
        .catch(error => showError(error.message));
}
```

### 9. 数据同步策略

**自动同步 + 手动同步**：
- 自动同步：延迟 3 秒执行，避免频繁请求
- 手动同步：用户点击同步按钮立即执行
- 状态更新：实时反馈同步状态

### 10. 安全性

- PIN 码不存储在 localStorage，仅保存在内存中
- 云端数据使用 AES 加密
- 使用 Supabase RLS 确保数据隔离
- 密码由 Supabase Auth bcrypt 哈希

## 提交规范

```
<type>: <subject>

<body>

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Type 类型**：
- `feat`: 新功能
- `fix`: 修复 bug
- `refactor`: 代码重构（不改变功能）
- `docs`: 文档更新
- `style`: 代码格式调整

**示例**：
```
Fix: 修复错字自动同步问题

将原始函数定义移到覆盖逻辑之前，
确保 autoSync() 能正确触发。

Co-Authored-By: Claude <noreply@anthropic.com>
```
