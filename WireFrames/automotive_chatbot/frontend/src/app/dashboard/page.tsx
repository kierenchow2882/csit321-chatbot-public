'use client';

import React, { useState, useEffect } from 'react';
import { ChatService } from '../../business/ChatService';
import { RasaController } from '../../controllers/RasaController';

interface Intent {
  name: string;
  examples: string[];
}

interface Response {
  name: string;
  text: string[];
}

interface Story {
  name: string;
  steps: Array<{
    intent?: string;
    action?: string;
    entities?: any[];
  }>;
}

const RasaDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intents' | 'responses' | 'stories'>('intents');
  const [intents, setIntents] = useState<Intent[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const rasaController = new RasaController();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await rasaController.loadRasaData();
      setIntents(data.intents || []);
      setResponses(data.responses || []);
      setStories(data.stories || []);
    } catch (error) {
      console.error('Failed to load RASA data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      await rasaController.saveRasaData({
        intents,
        responses,
        stories
      });
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Failed to save RASA data:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addIntent = () => {
    setIntents([...intents, { name: '', examples: [''] }]);
  };

  const updateIntent = (index: number, field: keyof Intent, value: any) => {
    const updated = [...intents];
    updated[index] = { ...updated[index], [field]: value };
    setIntents(updated);
  };

  const deleteIntent = (index: number) => {
    setIntents(intents.filter((_, i) => i !== index));
  };

  const addResponse = () => {
    setResponses([...responses, { name: '', text: [''] }]);
  };

  const updateResponse = (index: number, field: keyof Response, value: any) => {
    const updated = [...responses];
    updated[index] = { ...updated[index], [field]: value };
    setResponses(updated);
  };

  const deleteResponse = (index: number) => {
    setResponses(responses.filter((_, i) => i !== index));
  };

  const addStory = () => {
    setStories([...stories, { name: '', steps: [{ intent: '' }] }]);
  };

  const updateStory = (index: number, field: keyof Story, value: any) => {
    const updated = [...stories];
    updated[index] = { ...updated[index], [field]: value };
    setStories(updated);
  };

  const deleteStory = (index: number) => {
    setStories(stories.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RASA Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your chatbot's intents, responses, and stories</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Reload'}
              </button>
              <button
                onClick={saveData}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {(['intents', 'responses', 'stories'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Intents Tab */}
            {activeTab === 'intents' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Intents</h2>
                  <button
                    onClick={addIntent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Intent
                  </button>
                </div>

                <div className="space-y-4">
                  {intents.map((intent, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <input
                          type="text"
                          placeholder="Intent name (e.g., greet)"
                          value={intent.name}
                          onChange={(e) => updateIntent(index, 'name', e.target.value)}
                          className="text-lg font-medium border-none outline-none bg-transparent"
                        />
                        <button
                          onClick={() => deleteIntent(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Training Examples:
                        </label>
                        {intent.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Training example"
                              value={example}
                              onChange={(e) => {
                                const updated = [...intent.examples];
                                updated[exampleIndex] = e.target.value;
                                updateIntent(index, 'examples', updated);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                              onClick={() => {
                                const updated = intent.examples.filter((_, i) => i !== exampleIndex);
                                updateIntent(index, 'examples', updated);
                              }}
                              className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const updated = [...intent.examples, ''];
                            updateIntent(index, 'examples', updated);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add Example
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Responses Tab */}
            {activeTab === 'responses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Responses</h2>
                  <button
                    onClick={addResponse}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Response
                  </button>
                </div>

                <div className="space-y-4">
                  {responses.map((response, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <input
                          type="text"
                          placeholder="Response name (e.g., utter_greet)"
                          value={response.name}
                          onChange={(e) => updateResponse(index, 'name', e.target.value)}
                          className="text-lg font-medium border-none outline-none bg-transparent"
                        />
                        <button
                          onClick={() => deleteResponse(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Response Texts:
                        </label>
                        {response.text.map((text, textIndex) => (
                          <div key={textIndex} className="flex gap-2 mb-2">
                            <textarea
                              placeholder="Response text"
                              value={text}
                              onChange={(e) => {
                                const updated = [...response.text];
                                updated[textIndex] = e.target.value;
                                updateResponse(index, 'text', updated);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                              rows={2}
                            />
                            <button
                              onClick={() => {
                                const updated = response.text.filter((_, i) => i !== textIndex);
                                updateResponse(index, 'text', updated);
                              }}
                              className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const updated = [...response.text, ''];
                            updateResponse(index, 'text', updated);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add Response Variant
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stories Tab */}
            {activeTab === 'stories' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Stories</h2>
                  <button
                    onClick={addStory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Story
                  </button>
                </div>

                <div className="space-y-4">
                  {stories.map((story, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <input
                          type="text"
                          placeholder="Story name"
                          value={story.name}
                          onChange={(e) => updateStory(index, 'name', e.target.value)}
                          className="text-lg font-medium border-none outline-none bg-transparent"
                        />
                        <button
                          onClick={() => deleteStory(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Story Steps:
                        </label>
                        {story.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex gap-2 mb-2 p-3 bg-gray-50 rounded">
                            <select
                              value={step.intent ? 'intent' : 'action'}
                              onChange={(e) => {
                                const updated = [...story.steps];
                                if (e.target.value === 'intent') {
                                  updated[stepIndex] = { intent: '' };
                                } else {
                                  updated[stepIndex] = { action: '' };
                                }
                                updateStory(index, 'steps', updated);
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="intent">Intent</option>
                              <option value="action">Action</option>
                            </select>
                            <input
                              type="text"
                              placeholder={step.intent ? "Intent name" : "Action name"}
                              value={step.intent || step.action || ''}
                              onChange={(e) => {
                                const updated = [...story.steps];
                                if (step.intent !== undefined) {
                                  updated[stepIndex] = { intent: e.target.value };
                                } else {
                                  updated[stepIndex] = { action: e.target.value };
                                }
                                updateStory(index, 'steps', updated);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                              onClick={() => {
                                const updated = story.steps.filter((_, i) => i !== stepIndex);
                                updateStory(index, 'steps', updated);
                              }}
                              className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const updated = [...story.steps, { intent: '' }];
                            updateStory(index, 'steps', updated);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add Step
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RasaDashboard; 