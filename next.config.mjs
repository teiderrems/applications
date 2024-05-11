/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    staticPageGenerationTimeout:1000,
    images: { 
        remotePatterns:[
            {
                protocol:'https',
                hostname:"applications-api2.vercel.app",
                port:'',
                pathname:'/profile/**'
            },
            {
                protocol:'http',
                hostname:'localhost',
                port:'5000',
                pathname:'/**/**'
            },
            {
                protocol:'http',
                hostname:"applications-api2.vercel.app",
                port:'',
                pathname:'/**/**'
            }
        ]
    } 
};

export default nextConfig;
