/**
 * Main Page Component
 * Uses BCE framework for automotive chatbot
 */

import { ChatInterface } from '../components/ChatInterface';
import Link from 'next/link';
import { Metadata } from 'next';
import { DemoButton } from '../components/DemoButton';

export const metadata: Metadata = {
  title: 'Automotive Chatbot Platform',
  description: 'Create and manage your automotive chatbots with AI-powered assistance',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Automotive Chatbot Platform
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create, customize, and deploy intelligent chatbots for your automotive business
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <DemoButton />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Create Chatbots</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Easily create and customize chatbots for your automotive business needs
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Customize & Train</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Train your chatbots with industry-specific knowledge and customize their responses
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Embed Anywhere</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Easily embed your chatbots on your website or integrate with your existing systems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Demo Section */}
        <div id="chat-section" className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Try Our Automotive AI Assistant
            </h2>
            <p className="text-gray-600">
              Get expert automotive advice and maintenance tips from our AI assistant
            </p>
          </div>
          
          <div className="h-[600px] bg-white rounded-lg shadow-lg p-4">
            <ChatInterface className="h-full" />
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Built with BCE Framework (Business-Controller-Entity) • 
              Powered by RASA & FastAPI
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 