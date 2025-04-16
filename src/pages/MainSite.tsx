
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ExternalLink } from 'lucide-react';

const MainSite = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a ticket in the URL (returning from CAS)
    const ticket = searchParams.get('ticket');
    
    if (ticket) {
      // In a real app, we would validate the ticket with the CAS server here
      // For this demo, we'll just accept any ticket as valid
      console.log('Received ticket:', ticket);
      localStorage.setItem('main_site_authenticated', 'true');
      localStorage.setItem('main_site_ticket', ticket);
      
      // Read username from localStorage (set by CAS service)
      const casUsername = localStorage.getItem('cas_username');
      if (casUsername) {
        setUsername(casUsername);
        localStorage.setItem('main_site_username', casUsername);
      }
      
      setIsAuthenticated(true);
      
      // Clean up the URL to remove the ticket
      const newUrl = window.location.pathname;
      navigate(newUrl);
      
      toast({
        title: "验证成功",
        description: `欢迎回来，${casUsername || '用户'}！`,
      });
    } else {
      // Check if we have authentication in localStorage
      const storedAuth = localStorage.getItem('main_site_authenticated');
      const storedUsername = localStorage.getItem('main_site_username');
      
      if (storedAuth === 'true' && storedUsername) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
      }
    }
  }, [searchParams, navigate]);

  const handleLogin = () => {
    // Redirect to CAS service
    const currentUrl = window.location.href;
    // In a real app, you would use your actual CAS server URL
    window.location.href = `/cas?service=${encodeURIComponent(currentUrl)}`;
  };
  
  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('main_site_authenticated');
    localStorage.removeItem('main_site_ticket');
    localStorage.removeItem('main_site_username');
    localStorage.removeItem('cas_authenticated');
    localStorage.removeItem('cas_username');
    setIsAuthenticated(false);
    
    toast({
      title: "已退出登录",
      description: "您已成功退出当前账号",
    });
  };
  
  const goToMailSite = () => {
    // Navigate to the mail subdomain
    // In a real app, this would use a different domain
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
                </div>
                
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Button onClick={goToMailSite} className="flex items-center gap-2">
                    访问邮件系统 <ExternalLink size={16} />
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    退出登录
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
                <Button onClick={handleLogin}>
                  CAS登录
                </Button>
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
            <li>用户在CAS服务器上进行身份验证（如尚未登录）</li>
            <li>验证成功后，CAS重定向用户回原服务，并附上验证票据（ticket）</li>
            <li>服务使用该票据向CAS服务器验证用户身份</li>
            <li>验证成功后，用户可以访问该服务</li>
            <li>用户访问另一个服务时，由于已在CAS中登录，可以直接获得票据并访问</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MainSite;
