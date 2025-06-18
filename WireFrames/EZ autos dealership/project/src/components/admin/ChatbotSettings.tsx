import React, { useState, useEffect } from 'react';
import { Plus, Search, Settings, Trash2, Edit2, Save, X } from 'lucide-react';
import { getChatbotSettings, createChatbotSetting, updateChatbotSetting, deleteChatbotSetting } from '../../lib/api';

interface ChatbotSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  is_active: boolean;
  updated_at: string;
}

const ChatbotSettings: React.FC = () => {
  const [settings, setSettings] = useState<ChatbotSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    setting_key: '',
    setting_value: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getChatbotSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching chatbot settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let settingValue;
      try {
        settingValue = JSON.parse(formData.setting_value);
      } catch {
        settingValue = formData.setting_value;
      }

      const settingData = {
        ...formData,
        setting_value: settingValue,
      };

      if (editingId) {
        await updateChatbotSetting(editingId, settingData);
        setEditingId(null);
      } else {
        await createChatbotSetting(settingData);
        setShowAddModal(false);
      }
      
      setFormData({
        setting_key: '',
        setting_value: '',
        description: '',
        is_active: true,
      });
      fetchSettings();
    } catch (error) {
      console.error('Error saving chatbot setting:', error);
    }
  };

  const handleEdit = (setting: ChatbotSetting) => {
    setEditingId(setting.id);
    setFormData({
      setting_key: setting.setting_key,
      setting_value: JSON.stringify(setting.setting_value, null, 2),
      description: setting.description || '',
      is_active: setting.is_active,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      setting_key: '',
      setting_value: '',
      description: '',
      is_active: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this setting?')) {
      try {
        await deleteChatbotSetting(id);
        fetchSettings();
      } catch (error) {
        console.error('Error deleting chatbot setting:', error);
      }
    }
  };

  const handleToggleActive = async (setting: ChatbotSetting) => {
    try {
      await updateChatbotSetting(setting.id, {
        ...setting,
        is_active: !setting.is_active,
      });
      fetchSettings();
    } catch (error) {
      console.error('Error updating setting status:', error);
    }
  };

  const filteredSettings = settings.filter(setting =>
    setting.setting_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (setting.description && setting.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chatbot settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Chatbot Settings</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search settings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Setting
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSettings.map((setting) => (
          <div key={setting.id} className="border rounded-lg p-4">
            {editingId === setting.id ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Setting Key</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    value={formData.setting_key}
                    onChange={(e) => setFormData({ ...formData, setting_key: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Setting Value (JSON)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={formData.setting_value}
                    onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="text-blue-600" size={20} />
                      <h3 className="text-lg font-medium text-gray-900">{setting.setting_key}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        setting.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {setting.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {setting.description && (
                      <p className="text-sm text-gray-600 mb-2">{setting.description}</p>
                    )}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                        {JSON.stringify(setting.setting_value, null, 2)}
                      </pre>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(setting.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(setting)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        setting.is_active 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {setting.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(setting)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(setting.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSettings.length === 0 && (
        <div className="text-center py-12">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No chatbot settings found</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Add Your First Setting
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Chatbot Setting</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Setting Key</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.setting_key}
                    onChange={(e) => setFormData({ ...formData, setting_key: e.target.value })}
                    placeholder="e.g., welcome_message"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Setting Value (JSON)</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows={4}
                    value={formData.setting_value}
                    onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })}
                    placeholder='{"message": "Hello! How can I help you?"}'
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this setting"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="add_is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="add_is_active" className="text-sm text-gray-700">Active</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Setting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotSettings;