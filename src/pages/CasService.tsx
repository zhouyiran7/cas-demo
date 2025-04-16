
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const CasService = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the service URL that requested authentication
  const serviceUrl = searchParams.get('service') || '/';
  
  // Check if user is already authenticated in CAS
  useEffect(() => {
    const casAuthenticated = localStorage.getItem('cas_authenticated');
    const casUsername = localStorage.getItem('cas_username');
    
    if (casAuthenticated === 'true' && casUsername && serviceUrl) {
      // User is already authenticated, generate a ticket and redirect back
      const ticket = `ST-${Math.random().toString(36).substring(2, 15)}`;
      const redirectUrl = new URL(serviceUrl);
      redirectUrl.searchParams.append('ticket', ticket);
      
      toast({
        title: "已登录",
        description: "您已登录，正在跳转回原始服务...",
      });
      
      // Short delay for toast to be visible
      setTimeout(() => {
        window.location.href = redirectUrl.toString();
      }, 500);
    }
  }, [serviceUrl]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate authentication (in real-world scenario, this would make a backend call)
    setTimeout(() => {
      if (username === 'demo' && password === 'password') {
        // Generate a fake ticket
        const ticket = `ST-${Math.random().toString(36).substring(2, 15)}`;
        
        // Redirect back to the service with the ticket
        // In a real CAS implementation, this would be validated by the service
        const redirectUrl = new URL(serviceUrl);
        redirectUrl.searchParams.append('ticket', ticket);
        
        // Save authentication in localStorage (simulating a session)
        localStorage.setItem('cas_authenticated', 'true');
        localStorage.setItem('cas_username', username);
        
        toast({
          title: "登录成功",
          description: "正在跳转回原始服务...",
        });
        
        // Redirect to the service that requested authentication
        window.location.href = redirectUrl.toString();
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
