import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ExternalLink, Mail, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const MainSite = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [searchParams] = useSearchParams();
  const [serviceTicket, setServiceTicket] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const ticket = searchParams.get('ticket');
    
    if (ticket) {
      console.log('Received ticket:', ticket);
      localStorage.setItem('main_site_authenticated', 'true');
      localStorage.setItem('main_site_ticket', ticket);
      
      setServiceTicket(ticket);
      
      const casUsername = localStorage.getItem('cas_username');
      if (casUsername) {
        setUsername(casUsername);
        localStorage.setItem('main_site_username', casUsername);
      }
      
      setIsAuthenticated(true);
      
      const newUrl = window.location.pathname;
      navigate(newUrl);
      
      toast({
        title: "验证成功",
        description: `欢迎回来，${casUsername || '用户'}！服务票据 (ST) 已验证。`,
      });
    } else {
      const storedAuth = localStorage.getItem('main_site_authenticated') || localStorage.getItem('cas_authenticated');
      const storedUsername = localStorage.getItem('main_site_username') || localStorage.getItem('cas_username');
      
      if ((storedAuth === 'true') && storedUsername) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
      }
    }
  }, [searchParams, navigate]);

  const handleLogin = () => {
    const currentUrl = window.location.href;
    window.location.href = `/cas?service=${encodeURIComponent(currentUrl)}`;
  };
  
  const handleLogout = () => {
    localStorage.removeItem('main_site_authenticated');
    localStorage.removeItem('main_site_ticket');
    localStorage.removeItem('main_site_username');
    localStorage.removeItem('cas_authenticated');
    localStorage.removeItem('cas_username');
    localStorage.removeItem('cas_tgt');
    localStorage.removeItem('cas_service_tickets');
    setIsAuthenticated(false);
    setServiceTicket(null);
    
    toast({
      title: "已退出登录",
      description: "您已成功退出当前账号，TGT已销毁",
    });
  };
  
  const goToMailSite = () => {
    navigate('/mail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            yaibu.com
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            主站演示 - CAS单点登录示例
          </p>
        </header>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>主站点演示</CardTitle>
            <CardDescription>CAS单点登录示例 - 主域名站点</CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="font-medium text-green-800">
                    您已登录 ✓
                  </p>
                  <p className="text-green-700">
                    欢迎回来，{username}！
                  </p>
                  {serviceTicket && (
                    <div className="mt-2 p-2 bg-white rounded border border-green-100 text-xs font-mono">
                      <p className="text-gray-600">服务票据 (ST): {serviceTicket}</p>
                      <p className="text-gray-500 text-xs mt-1">此票据已被验证并消费</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Button onClick={goToMailSite} className="flex items-center gap-2">
                    <Mail size={16} /> 访问邮件系统
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    退出登录
                  </Button>
                  <Button variant="secondary" asChild className="flex items-center gap-2">
                    <Link to="/docs">
                      <FileText size={16} /> 查看文档
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="font-medium text-yellow-800">
                    您尚未登录
                  </p>
                  <p className="text-yellow-700">
                    请点击按钮进行CAS登录
                  </p>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Button onClick={handleLogin}>
                    CAS登录
                  </Button>
                  <Button variant="secondary" asChild className="flex items-center gap-2">
                    <Link to="/docs">
                      <FileText size={16} /> 查看文档
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              演示说明：CAS单点登录可以让您一次登录，访问所有关联系统。
            </p>
          </CardFooter>
        </Card>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">CAS单点登录流程</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>用户访问需要身份验证的服务（如主站或邮件系统）</li>
            <li>服务将用户重定向至中央CAS服务器，并附上自己的URL作为参数</li>
            <li>用户在CAS服务器上进行身份验证，成功后CAS服务器创建<strong>TGT</strong>并发送<strong>TGC</strong>给浏览器</li>
            <li>CAS使用TGT生成<strong>服务票据(ST)</strong>并重定向用户回原服务</li>
            <li>服务使用该票据向CAS服务器验证用户身份</li>
            <li>用户访问另一个服务时，CAS检测到用户已有<strong>TGC</strong>，可直接颁发新的<strong>ST</strong></li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MainSite;
