export default function r(){const u=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";return {rules:{userAgent:"*",allow:"/",disallow:["/api/","/admin"]},sitemap:`${u}/sitemap.xml`}}
