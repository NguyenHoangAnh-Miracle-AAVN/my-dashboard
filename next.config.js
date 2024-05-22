/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/about',
                destination: '/',
                permanent: true
            },
            {
                source:'/blog/:id',
                destination: '/dashboard/invoices/:id',
                permanent: true
            },
        ]
    }
};

module.exports = nextConfig;
