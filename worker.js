/**
 * Cloudflare Worker - GitHub Gist API 代理
 *
 * 功能：
 * - 代理 GitHub Gist API 请求
 * - 在服务端添加 GitHub Token（不暴露给前端）
 * - 支持 CORS，允许前端跨域调用
 */

// 从环境变量获取 GitHub Token
// 在 Cloudflare Dashboard 设置：Settings → Variables and Secrets
const GITHUB_TOKEN = 'HANZI_GITHUB_TOKEN_PLACEHOLDER';

export default {
  async fetch(request, env, ctx) {
    // 使用环境变量中的真实 token
    const token = env.HANZI_GITHUB_TOKEN || GITHUB_TOKEN;

    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // 路由处理
      if (path === '/api/gists' && request.method === 'POST') {
        return await createGist(request, token);
      } else if (path.startsWith('/api/gists/') && request.method === 'PATCH') {
        const gistId = path.split('/').pop();
        return await updateGist(request, gistId, token);
      } else if (path.startsWith('/api/gists/') && request.method === 'GET') {
        const gistId = path.split('/').pop();
        return await getGist(gistId);
      } else {
        return new Response('Not Found', { status: 404 });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

// 创建 Gist
async function createGist(request, token) {
  const body = await request.json();

  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'HanziLearning-App',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// 更新 Gist
async function updateGist(request, gistId, token) {
  const body = await request.json();

  // 先获取现有 Gist
  const getResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'HanziLearning-App',
    },
  });

  if (!getResponse.ok) {
    return new Response(JSON.stringify({ error: 'Gist not found' }), {
      status: getResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const existingGist = await getResponse.json();
  const fileName = Object.keys(existingGist.files)[0];

  // 更新 Gist
  const patchResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'HanziLearning-App',
    },
    body: JSON.stringify({
      files: {
        [fileName]: {
          content: body.content,
        },
      },
    }),
  });

  const data = await patchResponse.json();

  return new Response(JSON.stringify(data), {
    status: patchResponse.ok ? 200 : patchResponse.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// 获取 Gist（公开的 gist 不需要 token）
async function getGist(gistId) {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'User-Agent': 'HanziLearning-App',
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
