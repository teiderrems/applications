/** @type {import('next').NextConfig} */
const nextConfig = {
    staticPageGenerationTimeout:1000,
    images: { 
        remotePatterns:[
            {
                protocol:'https',
                hostname:"xhoxeirzigj3b1n5.public.blob.vercel-storage.com",
                port:'',
                pathname:'/**/**'
            }
        ]
    } 
};

export default nextConfig;
