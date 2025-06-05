'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface Story {
  story: string;
  steps: Array<{
    intent?: string;
    action?: string;
    slot_was_set?: any;
  }>;
  metadata?: any;
}

const StoriesManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState({
    story_name: '',
    steps: [] as any[]
  });

  useEffect(() => {
    if (token) {
      loadStories();
    } else {
      router.push('/admin');
    }
  }, [token, router]);

  const loadStories = async () => {
    try {
      const response = await fetch('/api/admin/stories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStories(data.stories || []);
      } else {
        alert('Failed to load stories');
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      alert('Error loading stories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingStory(null);
    setFormData({
      story_name: '',
      steps: [{ intent: '', action: '' }]
    });
    setShowModal(true);
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({
      story_name: story.story,
      steps: story.steps
    });
    setShowModal(true);
  };

  const handleDelete = async (storyName: string) => {
    if (!confirm(`Are you sure you want to delete the story "${storyName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/stories/${encodeURIComponent(storyName)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadStories();
        alert('Story deleted successfully');
      } else {
        alert('Failed to delete story');
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Error deleting story');
    }
  };

  const handleSave = async () => {
    if (!formData.story_name.trim()) {
      alert('Please enter a story name');
      return;
    }

    const storyData = {
      story_name: formData.story_name,
      steps: formData.steps.filter(step => step.intent || step.action)
    };

    try {
      const url = editingStory 
        ? `/api/admin/stories/${encodeURIComponent(editingStory.story)}`
        : '/api/admin/stories';
      
      const method = editingStory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(storyData)
      });

      if (response.ok) {
        loadStories();
        setShowModal(false);
        alert(`Story ${editingStory ? 'updated' : 'created'} successfully`);
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to save story');
      }
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Error saving story');
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { intent: '', action: '' }]
    });
  };

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push(`/admin?token=${encodeURIComponent(token)}`)}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Stories Management</h1>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Story
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Training Stories ({stories.length})
            </h2>
          </div>
          
          {stories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No stories found</h3>
              <p>Create your first conversation story to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {stories.map((story, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {story.story}
                      </h3>
                      <div className="space-y-1">
                        {story.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="text-sm text-gray-600 flex items-center">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs mr-3">
                              {stepIndex + 1}
                            </span>
                            {step.intent && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                                Intent: {step.intent}
                              </span>
                            )}
                            {step.action && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                                Action: {step.action}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(story)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(story.story)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingStory ? 'Edit Story' : 'Create New Story'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Name
                </label>
                <input
                  type="text"
                  value={formData.story_name}
                  onChange={(e) => setFormData({ ...formData, story_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter story name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Steps
                </label>
                {formData.steps.map((step, index) => (
                  <div key={index} className="border rounded-md p-3 mb-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Step {index + 1}</span>
                      <button
                        onClick={() => removeStep(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Intent
                        </label>
                        <input
                          type="text"
                          value={step.intent || ''}
                          onChange={(e) => updateStep(index, 'intent', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="e.g., greet"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Action
                        </label>
                        <input
                          type="text"
                          value={step.action || ''}
                          onChange={(e) => updateStep(index, 'action', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="e.g., utter_greet"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addStep}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  + Add Step
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingStory ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesManagement; 