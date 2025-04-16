
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Mail, Home } from 'lucide-react';

const MailSite = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [emails, setEmails] = useState<Array<{id: number, subject: string, sender: string, preview: string}>>([]);
  
  useEffect(() => {
    // Check if there's a ticket in the URL (returning from CAS)
    const ticket = searchParams.get('ticket');
    
    if (ticket) {
      // In a real app, we would validate the ticket with the CAS server here
      // For this demo, we'll just accept any ticket as valid
      console.log('Received ticket on mail site:', ticket);
      localStorage.setItem('mail_site_authenticated', 'true');
      localStorage.setItem('mail_site_ticket', ticket);
      
      // Read username from localStorage (set by CAS service)
      const casUsername = localStorage.getItem('cas_username');
      if (casUsername) {
        setUsername(casUsername);
        localStorage.setItem('mail_site_username', casUsername);
      }
      
      setIsAuthenticated(true);
      
      // Clean up the URL to remove the ticket
      const newUrl = window.location.pathname;
      navigate(newUrl);
      
      toast({
        title: "邮件系统登录成功",
        description: `欢迎使用邮件系统，${casUsername || '用户'}！`,
      });

      // Generate some fake emails
      generateFakeEmails(casUsername || '用户');
    } else {
      // Check if we have authentication in localStorage
      const storedAuth = localStorage.getItem('mail_site_authenticated');
      const storedUsername = localStorage.getItem('mail_site_username');
      
      if (storedAuth === 'true' && storedUsername) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
        generateFakeEmails(storedUsername);
      }
    }
  }, [searchParams, navigate]);

  const generateFakeEmails = (user: string) => {
    const fakeEmails = [
      {
        id: 1,
        subject: "欢迎使用邮件系统",
        sender: "system@mail.yaibu.com",
        preview: `亲爱的${user}，感谢您使用我们的邮件系统。`
      },
      {
        id: 2,
        subject: "CAS单点登录测试",
        sender: "tech@yaibu.com",
        preview: "这是一封测试CAS单点登录功能的邮件。"
      },
      {
        id: 3,
        subject: "账户安全提醒",
        sender: "security@yaibu.com",
        preview: "请定期更改您的密码以确保账户安全。"
      }
    ];
    setEmails(fakeEmails);
  };

  const handleLogin = () => {
    // Redirect to CAS service
    const currentUrl = window.location.href;
    // In a real app, you would use your actual CAS server URL
    window.location.href = `/cas?service=${encodeURIComponent(currentUrl)}`;
  };
  
  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('mail_site_authenticated');
    localStorage.removeItem('mail_site_ticket');
    localStorage.removeItem('mail_site_username');
    localStorage.removeItem('cas_authenticated');
    localStorage.removeItem('cas_username');
    setIsAuthenticated(false);
    setEmails([]);
    
    toast({
      title: "已退出邮件系统",
      description: "您已成功退出当前账号",
    });
  };
  
  const goToMainSite = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            mail.yaibu.com
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            邮件系统演示 - CAS单点登录示例
          </p>
        </header>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>邮件系统</CardTitle>
            <CardDescription>CAS单点登录示例 - 邮件子域名</CardDescription>
          </CardHeader>
          <CardContent>
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="font-medium text-green-800">
                    您已登录邮件系统 ✓
                  </p>
                  <p className="text-green-700">
                    {username}的邮箱
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">收件箱</h3>
                  <div className="space-y-2">
                    {emails.map((email) => (
                      <div key={email.id} className="p-3 bg-white border rounded-md hover:bg-gray-50">
                        <p className="font-medium">{email.subject}</p>
                        <p className="text-sm text-gray-500">来自: {email.sender}</p>
                        <p className="text-sm text-gray-700 mt-1">{email.preview}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Button onClick={goToMainSite} variant="outline" className="flex items-center gap-2">
                    <Home size={16} /> 返回主站
                  </Button>
                  <Button variant="outline" onClick={handleLogout} className="text-red-500 border-red-200 hover:bg-red-50">
                    退出登录
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="font-medium text-yellow-800">
                    您尚未登录邮件系统
                  </p>
                  <p className="text-yellow-700">
                    请点击按钮进行CAS登录
                  </p>
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                  <Button onClick={handleLogin} className="flex items-center gap-2">
                    <Mail size={16} /> CAS登录
                  </Button>
                  <Button variant="outline" onClick={goToMainSite}>
                    返回主站
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              演示说明：如果您已在主站登录，则无需再次登录即可访问邮件系统。
            </p>
          </CardFooter>
        </Card>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">CAS在子域名中的应用</h2>
          <p className="mb-4">在实际应用中，mail.yaibu.com将是一个独立的子域名，通过CAS实现与主站的单点登录。在本演示中，我们使用同一应用下的不同路由来模拟这一流程。</p>
          <p>在生产环境中，各个应用通常需要:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>将各自的服务注册到CAS服务器</li>
            <li>实现票据验证机制以向CAS验证票据的有效性</li>
            <li>处理共享会话或令牌以维持登录状态</li>
            <li>实现统一登出机制以在所有服务中一次性登出</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MailSite;
