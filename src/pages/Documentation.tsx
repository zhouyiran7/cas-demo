
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Key } from 'lucide-react';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            CAS单点登录系统文档
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            本文档详细介绍了CAS单点登录示例的实现原理与流程
          </p>
        </header>

        <div className="mb-8 flex justify-center gap-4">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft size={16} /> 返回主站
            </Link>
          </Button>
          <Button asChild className="flex items-center gap-2">
            <Link to="/mail">
              访问邮件系统 <ExternalLink size={16} />
            </Link>
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>系统概述</CardTitle>
            <CardDescription>本演示实现了CAS单点登录的核心流程</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              本示例模拟了一个包含多个服务的系统环境，通过CAS协议实现单点登录功能。用户只需在CAS服务器上登录一次，即可访问所有接入的应用系统，无需重复认证。
            </p>
            <p>
              系统包含以下组件:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>主站点 (yaibu.com)</strong> - 作为系统中的一个服务，接入CAS登录</li>
              <li><strong>邮件系统 (mail.yaibu.com)</strong> - 另一个独立服务，同样接入CAS登录</li>
              <li><strong>CAS服务器</strong> - 提供统一的认证服务，管理用户会话和票据</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>CAS协议关键概念</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <Key size={18} className="text-blue-600" /> TGT (Ticket Granting Ticket)
                </h3>
                <p className="text-sm">
                  用户在CAS服务器上成功认证后创建的票据，代表用户的登录会话。TGT存储在CAS服务器端，包含用户身份信息和会话过期时间。
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <Key size={18} className="text-green-600" /> TGC (Ticket Granting Cookie)
                </h3>
                <p className="text-sm">
                  包含TGT标识符的Cookie，存储在用户浏览器中。当用户再次访问CAS服务器时，CAS通过TGC识别用户，无需重复登录。
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <Key size={18} className="text-purple-600" /> ST (Service Ticket)
                </h3>
                <p className="text-sm">
                  CAS服务器为特定服务生成的一次性票据。用户访问服务时，CAS生成ST并重定向用户回原服务，服务使用ST向CAS验证用户身份。
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <Key size={18} className="text-orange-600" /> 单点登录 (SSO)
                </h3>
                <p className="text-sm">
                  用户只需登录一次，即可访问所有接入CAS的系统。这通过TGT/TGC机制实现，避免用户在不同系统间重复输入凭据。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>CAS登录流程详解</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <div className="bg-gray-100 p-3 border-b">
                <h3 className="font-medium">首次登录流程</h3>
              </div>
              <div className="p-4 space-y-4">
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong>用户访问服务</strong>
                    <p className="text-sm text-gray-600">
                      用户访问需要认证的服务（如主站或邮件系统），服务检测用户未登录。
                    </p>
                  </li>
                  <li>
                    <strong>重定向至CAS服务器</strong>
                    <p className="text-sm text-gray-600">
                      服务将用户重定向至CAS服务器，并附上自己的URL作为service参数，格式为：
                      <code className="block bg-gray-50 p-2 mt-1 text-xs rounded">
                        /cas?service=https://yaibu.com
                      </code>
                    </p>
                  </li>
                  <li>
                    <strong>用户认证</strong>
                    <p className="text-sm text-gray-600">
                      用户在CAS服务器上输入凭据并认证。认证成功后，CAS服务器创建TGT并发送TGC给浏览器。
                    </p>
                  </li>
                  <li>
                    <strong>生成服务票据ST</strong>
                    <p className="text-sm text-gray-600">
                      CAS使用TGT生成一个针对请求服务的ST。
                    </p>
                  </li>
                  <li>
                    <strong>重定向回原服务</strong>
                    <p className="text-sm text-gray-600">
                      CAS将用户重定向回原服务，URL中包含ST，格式为：
                      <code className="block bg-gray-50 p-2 mt-1 text-xs rounded">
                        https://yaibu.com?ticket=ST-1234567890
                      </code>
                    </p>
                  </li>
                  <li>
                    <strong>服务验证票据</strong>
                    <p className="text-sm text-gray-600">
                      服务收到ST后，向CAS服务器验证票据有效性和用户身份。验证成功后，建立用户会话。
                    </p>
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg border mt-6">
              <div className="bg-gray-100 p-3 border-b">
                <h3 className="font-medium">后续服务访问流程</h3>
              </div>
              <div className="p-4 space-y-4">
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong>用户访问其他服务</strong>
                    <p className="text-sm text-gray-600">
                      已登录用户访问另一个接入CAS的服务（如邮件系统）。
                    </p>
                  </li>
                  <li>
                    <strong>重定向至CAS服务器</strong>
                    <p className="text-sm text-gray-600">
                      邮件系统将用户重定向至CAS服务器，带上service参数。
                    </p>
                  </li>
                  <li>
                    <strong>CAS检测到TGC</strong>
                    <p className="text-sm text-gray-600">
                      CAS服务器发现用户浏览器中有有效的TGC，无需用户再次登录。
                    </p>
                  </li>
                  <li>
                    <strong>生成新的ST</strong>
                    <p className="text-sm text-gray-600">
                      CAS为邮件系统生成一个新的ST。
                    </p>
                  </li>
                  <li>
                    <strong>重定向至邮件系统</strong>
                    <p className="text-sm text-gray-600">
                      CAS将用户重定向回邮件系统，URL中包含新的ST。
                    </p>
                  </li>
                  <li>
                    <strong>邮件系统验证ST</strong>
                    <p className="text-sm text-gray-600">
                      邮件系统验证ST，验证成功后允许用户访问。
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>示例实现说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              本示例为前端演示，所有逻辑在浏览器端实现。在实际生产环境中，CAS服务器应当是独立的后端服务，票据验证也应在服务器端进行。
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">实现简化与差异</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>使用localStorage模拟TGC存储，真实环境应使用安全HTTP-only Cookie</li>
                <li>票据验证在前端进行，真实环境应在服务器端通过后端API请求进行验证</li>
                <li>使用React Router模拟不同域名的服务，真实环境中应为不同子域名或域名</li>
                <li>固定用户名和密码为demo/password，便于测试</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">示例登录信息</h3>
              <p className="mb-2">使用以下凭据可以登录系统：</p>
              <div className="bg-white p-3 rounded border border-blue-100">
                <p>用户名：<strong>demo</strong></p>
                <p>密码：<strong>password</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>参考资源</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <a 
                href="https://apereo.github.io/cas/6.6.x/protocol/CAS-Protocol.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                CAS 协议官方文档 <ExternalLink size={14} />
              </a>
            </p>
            <p>
              <a 
                href="https://en.wikipedia.org/wiki/Central_Authentication_Service" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                CAS Wikipedia <ExternalLink size={14} />
              </a>
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              本文档仅供学习参考，展示CAS单点登录的基本原理与流程。
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
