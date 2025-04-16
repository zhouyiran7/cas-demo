
import React from 'react';
import Carousel from '@/components/Carousel';
import { carouselImages } from '@/data/carouselData';
import { Github } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            JavaScript 轮播图演示
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            基于 React 和现代 Web 技术实现的轮播图组件，参考 CSDN 文章
            <a 
              href="https://blog.csdn.net/qq_34246546/article/details/79493208"
              className="text-blue-600 hover:text-blue-800 underline mx-1"
              target="_blank" 
              rel="noopener noreferrer"
            >
              "原生JavaScript实现轮播图"
            </a>
            进行开发
          </p>
        </header>
        
        <main>
          <section className="mb-16">
            <Carousel 
              items={carouselImages} 
              autoPlay={true}
              interval={3000}
              showIndicators={true}
              showControls={true}
            />
          </section>
          
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">轮播图特点</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>自动轮播功能，可暂停和恢复</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>左右箭头导航控制</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>底部指示器显示当前位置</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>流畅的过渡动画效果</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>响应式设计，适应不同屏幕大小</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>可自定义间隔时间和其他选项</span>
              </li>
            </ul>
          </section>
        </main>
        
        <footer className="mt-16 text-center text-gray-600">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
            >
              <Github className="w-5 h-5" />
              <span>查看源码</span>
            </a>
          </div>
          <p>© {new Date().getFullYear()} 轮播图演示 | 使用 React、TypeScript 和 Tailwind CSS 构建</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
