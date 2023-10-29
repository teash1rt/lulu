export default {
    base: '/lulu/',
    lang: 'zh-CN',
    title: 'lulu',
    head: [['link', { rel: 'icon', href: '/logo.png' }]],
    themeConfig: {
        logo: '/logo.png',
        outline: [2, 3],
        socialLinks: [{ icon: 'github', link: 'https://github.com/teashirtt/lulu' }],
        sidebar: {
            '/info/': [
                {
                    items: [
                        { text: '介绍', link: '/info/intro' },
                        { text: '代办', link: '/info/todo' }
                    ]
                }
            ]
        },
        footer: {
            copyright: 'Copyright © 2023-present Teashirt'
        }
    }
}
