
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';

const CasService = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tgtInfo, setTgtInfo] = useState<{id: string, created: string, expires: string} | null>(null);
  
  // Get the service URL that requested authentication
  const serviceUrl = searchParams.get('service') || '/';
  
  // Check if user is already authenticated in CAS
  useEffect(() => {
    const casAuthenticated = localStorage.getItem('cas_authenticated');
    const casUsername = localStorage.getItem('cas_username');
    const casTGT = localStorage.getItem('cas_tgt');
    
    if (casAuthenticated === 'true' && casUsername && casTGT) {
      try {
        const tgt = JSON.parse(casTGT);
        setTgtInfo(tgt);
        
        // Check if TGT is still valid
        const expiryTime = new Date(tgt.expires).getTime();
        const currentTime = new Date().getTime();
        
        if (currentTime > expiryTime) {
          // TGT has expired
          localStorage.removeItem('cas_authenticated');
          localStorage.removeItem('cas_username');
          localStorage.removeItem('cas_tgt');
          setTgtInfo(null);
          toast({
            title: "会话已过期",
            description: "您的会话已过期，请重新登录",
          });
          return;
        }
        
        if (serviceUrl) {
          // User is already authenticated, generate a ticket and redirect back
          const ticket = `ST-${Math.random().toString(36).substring(2, 15)}`;
          const redirectUrl = new URL(serviceUrl);
          redirectUrl.searchParams.append('ticket', ticket);
          
          toast({
            title: "已登录",
            description: "您已登录，正在跳转回原始服务...",
          });
          
          // Record this ST in localStorage for demo purposes
          const serviceTickets = JSON.parse(localStorage.getItem('cas_service_tickets') || '[]');
          serviceTickets.push({
            ticket: ticket,
            service: serviceUrl,
            created: new Date().toISOString(),
            tgtId: tgt.id
          });
          localStorage.setItem('cas_service_tickets', JSON.stringify(serviceTickets));
          
          // Short delay for toast to be visible
          setTimeout(() => {
            window.location.href = redirectUrl.toString();
          }, 1500);
        }
      } catch (e) {
        localStorage.removeItem('cas_authenticated');
        localStorage.removeItem('cas_username');
        localStorage.removeItem('cas_tgt');
        setTgtInfo(null);
      }
    }
  }, [serviceUrl]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate authentication (in real-world scenario, this would make a backend call)
    setTimeout(() => {
      if (username === 'demo' && password === 'password') {
        // Generate TGT - this would normally be done server-side
        const tgtId = `TGT-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
        const now = new Date();
        const expires = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours from now
        
        const tgt = {
          id: tgtId,
          created: now.toISOString(),
          expires: expires.toISOString(),
          username: username
        };
        
        // Store TGT in localStorage (in a real CAS system, this would be a secure cookie)
        localStorage.setItem('cas_tgt', JSON.stringify(tgt));
        localStorage.setItem('cas_authenticated', 'true');
        localStorage.setItem('cas_username', username);
        
        setTgtInfo(tgt);
        
        // Generate a Service Ticket (ST)
        const ticket = `ST-${Math.random().toString(36).substring(2, 15)}`;
        
        // Record this ST in localStorage for demo purposes
        const serviceTickets = JSON.parse(localStorage.getItem('cas_service_tickets') || '[]');
        serviceTickets.push({
          ticket: ticket,
          service: serviceUrl,
          created: new Date().toISOString(),
          tgtId: tgtId
        });
        localStorage.setItem('cas_service_tickets', JSON.stringify(serviceTickets));
        
        // Redirect back to the service with the ticket
        const redirectUrl = new URL(serviceUrl);
        redirectUrl.searchParams.append('ticket', ticket);
        
        toast({
          title: "登录成功",
          description: "已生成TGT和ST，正在跳转回原始服务...",
        });
        
        // Longer delay to allow user to see the TGT information
        setTimeout(() => {
          window.location.href = redirectUrl.toString();
        }, 2500);
      } else {
        setError('用户名或密码不正确。提示: 使用 demo/password');
        setIsLoading(false);
      }
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">CAS认证中心</CardTitle>
          <CardDescription>
            统一身份认证服务
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {tgtInfo ? (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-md font-medium text-blue-800 mb-2 flex items-center">
                <Clock className="mr-2 h-4 w-4" /> TGT信息 (Ticket Granting Ticket)
              </h3>
              <div className="text-xs font-mono bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                <p><span className="text-gray-500">ID:</span> {tgtInfo.id}</p>
                <p><span className="text-gray-500">创建时间:</span> {new Date(tgtInfo.created).toLocaleString()}</p>
                <p><span className="text-gray-500">过期时间:</span> {new Date(tgtInfo.expires).toLocaleString()}</p>
                <p><span className="text-gray-500">用户:</span> {username || localStorage.getItem('cas_username')}</p>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                在真实的CAS系统中，TGT会以安全Cookie (TGC) 的形式存储在浏览器中
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="username">
                    用户名
                  </label>
                  <Input
                    id="username"
                    placeholder="输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="password">
                    密码
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "登录中..." : "登录"}
                </Button>
                <p className="text-sm text-center text-gray-500">
                  提示: 使用 demo/password 登录
                </p>
              </div>
            </form>
          )}

          <div className="mt-6 text-xs text-gray-500 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-1">CAS协议核心概念:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>TGT (Ticket Granting Ticket):</strong> 用户认证成功后，CAS服务器创建的票据</li>
              <li><strong>TGC (Ticket Granting Cookie):</strong> 包含TGT标识符的Cookie，存储在浏览器中</li>
              <li><strong>ST (Service Ticket):</strong> 由CAS生成的针对特定服务的一次性票据</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center text-gray-500 w-full">
            请求来源: {serviceUrl}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CasService;
