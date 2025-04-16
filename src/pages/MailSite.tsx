
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Mail, Home, Clock } from 'lucide-react';

const MailSite = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [emails, setEmails] = useState<Array<{id: number, subject: string, sender: string, preview: string}>>([]);
  const [serviceTicket, setServiceTicket] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if there's a ticket in the URL (returning from CAS)
    const ticket = searchParams.get('ticket');
    
    // First check if the user is already authenticated in CAS
    const casAuthenticated = localStorage.getItem('cas_authenticated');
    const casUsername = localStorage.getItem('cas_username');
    const casTGT = localStorage.getItem('cas_tgt');
    
    if (casAuthenticated === 'true' && casUsername && casTGT) {
      try {
        const tgt = JSON.parse(casTGT);
        // Check if TGT is still valid
        const expiryTime = new Date(tgt.expires).getTime();
        const currentTime = new Date().getTime();
        
        if (currentTime > expiryTime) {
          // TGT has expired, redirect to login
          handleLogin();
          return;
        }
        
        console.log('User already authenticated in CAS, using existing session');
        setIsAuthenticated(true);
        setUsername(casUsername);
        localStorage.setItem('mail_site_authenticated', 'true');
        localStorage.setItem('mail_site_username', casUsername);
        generateFakeEmails(casUsername);
        
        // If we don't have a ticket but we're coming here directly with a valid TGT
        if (!ticket && !localStorage.getItem('mail_site_ticket')) {
          toast({
            title: "单点登录成功",
            description: "使用现有TGT自动登录，无需重新认证",
          });
        }
      } catch (e) {
        // Invalid TGT format, clear authentication
        localStorage.removeItem('cas_authenticated');
        localStorage.removeItem('cas_username');
        localStorage.removeItem('cas_tgt');
      }
      return;
    }
    
    if (ticket) {
      // In a real app, we would validate the ticket with the CAS server here
      console.log('Received ticket on mail site:', ticket);
      localStorage.setItem('mail_site_authenticated', 'true');
      localStorage.setItem('mail_site_ticket', ticket);
      setServiceTicket(ticket);
      
      // Read username from localStorage (set by CAS service)
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
        description: `欢迎使用邮件系统，${casUsername || '用户'}！服务票据 (ST) 已验证。`,
      });

      // Generate some fake emails
      generateFakeEmails(casUsername || '用户');
    } else {
      // Check if we have authentication in localStorage
      const storedAuth = localStorage.getItem('mail_site_authenticated');
      const storedUsername = localStorage.getItem('mail_site_username');
      const storedTicket = localStorage.getItem('mail_site_ticket');
      
      if (storedAuth === 'true' && storedUsername) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
        if (storedTicket) {
          setServiceTicket(storedTicket);
        }
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
    localStorage.removeItem('cas_tgt');
    localStorage.removeItem('cas_service_tickets');
    setIsAuthenticated(false);
    setEmails([]);
    setServiceTicket(null);
    
    toast({
      title: "已退出邮件系统",
      description: "您已成功退出当前账号，TGT已销毁",
    });
  };
  
  const goToMainSite = () => {
    navigate('/');
  };

  // Function to display TGT information if available
  const renderTgtInfo = () => {
    const casTGT = localStorage.getItem('cas_tgt');
    if (!casTGT) return null;
    
    try {
      const tgt = JSON.parse(casTGT);
      return (
        <div className="p-3 mt-4 bg-blue-50 border border-blue-200 rounded-md text-xs">
          <h3 className="text-sm font-medium text-blue-800 mb-1 flex items-center">
            <Clock className="mr-1 h-4 w-4" /> TGT状态
          </h3>
          <div className="bg-white p-2 rounded border border-blue-100 font-mono">
            <p><span className="text-gray-500">ID:</span> {tgt.id}</p>
            <p><span className="text-gray-500">过期时间:</span> {new Date(tgt.expires).toLocaleString()}</p>
          </div>
          <p className="mt-1 text-blue-600">此TGT使您能够在不重新登录的情况下访问所有关联服务</p>
        </div>
      );
    } catch (e) {
      return null;
    }
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
                  {serviceTicket && (
                    <div className="mt-2 p-2 bg-white rounded border border-green-100 text-xs font-mono">
                      <p className="text-gray-600">服务票据 (ST): {serviceTicket}</p>
                      <p className="text-gray-500 text-xs mt-1">此票据已被验证并消费</p>
                    </div>
                  )}
                  {renderTgtInfo()}
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
              演示说明：如果您已在主站登录，则无需再次登录即可访问邮件系统。这是因为您的浏览器中存有TGC。
            </p>
          </CardFooter>
        </Card>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">CAS在子域名中的应用</h2>
          <p className="mb-4">在实际应用中，mail.yaibu.com将是一个独立的子域名，通过CAS实现与主站的单点登录。在本演示中，我们使用同一应用下的不同路由来模拟这一流程。</p>
          <p>CAS认证流程包含以下关键概念:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>TGT (Ticket Granting Ticket)</strong>: 用户成功登录后，CAS服务器创建的凭证</li>
            <li><strong>TGC (Ticket Granting Cookie)</strong>: 包含TGT标识符的Cookie，存储在浏览器中</li>
            <li><strong>ST (Service Ticket)</strong>: CAS服务器根据TGT生成的，用于访问特定服务的一次性票据</li>
            <li><strong>单点登录</strong>: 用户只需登录一次，TGC使CAS能够识别已认证用户并为其颁发ST</li>
            <li><strong>单点登出</strong>: 用户登出时销毁TGT，确保所有服务的会话同时终止</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MailSite;
