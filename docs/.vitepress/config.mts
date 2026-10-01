import { defineConfig } from 'vitepress'

const sharedThemeConfig = {
  search: {
    provider: 'local' as const
  },
  logo: '/favicon-32x32.png',
  socialLinks: [
    { icon: 'github', link: 'https://github.com/doocs/coding-interview' }
  ]
}

const rootThemeConfig = {
  ...sharedThemeConfig,
  nav: [
    { text: '首页', link: '/' },
    { text: '题解', link: '/coding-interview' },
    { text: '编程之美', link: '/the-beauty-of-programming' },
    { text: '代码整洁之道', link: '/clean-code' },
    { text: '阿里巴巴 Java 开发手册', link: '/effective-coding' },
    { text: '枕边算法书', link: '/algorithm-stories' },
    { text: 'Effective Java', link: '/effective-java' }
  ],
  footer: {
    message: 'Released under the CC-BY-SA-4.0 license.',
    copyright: `版权所有 © 2018-${new Date().getFullYear()} <a href="https://github.com/doocs">Doocs</a>`
  },
  docFooter: {
    prev: '上一篇',
    next: '下一篇'
  },
  editLink: {
    pattern: 'https://github.com/doocs/coding-interview/edit/main/docs/:path',
    text: '在 GitHub 编辑'
  },
  sidebar: [
    {
      text: '📚 题解',
      items: [
        { text: '剑指 Offer', link: '/coding-interview' },
        { text: '编程之美', link: '/the-beauty-of-programming' }
      ]
    },
    {
      text: '📝 代码整洁',
      items: [
        { text: '代码整洁之道', link: '/clean-code' },
        { text: '阿里巴巴 Java 开发手册', link: '/effective-coding' }
      ]
    },
    {
      text: '📖 其他书籍',
      items: [
        { text: '枕边算法书', link: '/algorithm-stories' },
        { text: 'Effective Java', link: '/effective-java' }
      ]
    }
  ]
}

const vietnameseThemeConfig = {
  ...sharedThemeConfig,
  nav: [
    { text: 'Trang chủ', link: '/vi/' },
    { text: 'Lời giải', link: '/vi/coding-interview' },
    { text: 'Vẻ đẹp của lập trình', link: '/vi/the-beauty-of-programming' },
    { text: 'Clean Code', link: '/vi/clean-code' },
    { text: 'Cẩm nang phát triển Java của Alibaba', link: '/vi/effective-coding' },
    { text: 'Sách thuật toán gối đầu', link: '/vi/algorithm-stories' },
    { text: 'Effective Java', link: '/vi/effective-java' }
  ],
  footer: {
    message: 'Phát hành theo giấy phép CC-BY-SA-4.0.',
    copyright: `Bản quyền © 2018-${new Date().getFullYear()} <a href="https://github.com/doocs">Doocs</a>`
  },
  docFooter: {
    prev: 'Bài trước',
    next: 'Bài tiếp theo'
  },
  editLink: {
    pattern: 'https://github.com/doocs/coding-interview/edit/main/docs/:path',
    text: 'Chỉnh sửa trên GitHub'
  },
  sidebar: [
    {
      text: '📚 Lời giải',
      items: [
        { text: 'Kiếm chỉ Offer', link: '/vi/coding-interview' },
        { text: 'Vẻ đẹp của lập trình', link: '/vi/the-beauty-of-programming' }
      ]
    },
    {
      text: '📝 Code sạch',
      items: [
        { text: 'Clean Code', link: '/vi/clean-code' },
        { text: 'Cẩm nang phát triển Java của Alibaba', link: '/vi/effective-coding' }
      ]
    },
    {
      text: '📖 Sách khác',
      items: [
        { text: 'Sách thuật toán gối đầu', link: '/vi/algorithm-stories' },
        { text: 'Effective Java', link: '/vi/effective-java' }
      ]
    }
  ]
}

export default defineConfig({
  title: 'coding-interview',
  description: '互联网公司 IT 技术面试题集',
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      themeConfig: rootThemeConfig
    },
    vi: {
      label: 'Tiếng Việt',
      lang: 'vi-VN',
      title: 'coding-interview',
      description: 'Bộ câu hỏi phỏng vấn kỹ thuật IT tại các công ty Internet',
      link: '/vi/',
      themeConfig: vietnameseThemeConfig
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' }]
  ],
  cleanUrls: true,
  sitemap: {
    hostname: 'https://interview.doocs.org'
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000
    }
  }
})
