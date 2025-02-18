import React, { useState } from 'react';
import { Pencil, Trash2, ChevronDown, ChevronUp, Plus, Activity } from 'lucide-react';
import { Region } from '../types';

interface SegmentationDetailsProps {
  regions: Region[];
}

export function SegmentationDetails({ regions }: SegmentationDetailsProps) {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [editingRegion, setEditingRegion] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: '',
    dangerLevel: 'warning',
    confidence: 0,
    references: []
  });

  const handleEdit = (region: Region) => {
    setEditForm({
      name: region.details.title,
      dangerLevel: 'warning',
      confidence: 85,
      references: []
    });
    setEditingRegion(region.id);
    setExpandedRegion(region.id); // Auto-expand when editing
  };

  const handleAddReference = () => {
    setEditForm(prev => ({
      ...prev,
      references: [...prev.references, { title: '', source: '' }]
    }));
  };

  const handleRemoveReference = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Segmentation Details & Findings
        </h2>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleString()}
        </span>
      </div>

      <div className="space-y-4">
        {regions.map((region) => (
          <div key={region.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-red-500 rounded-full" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    {region.details.title}
                  </h3>
                  <p className="text-sm text-gray-500">85% confidence</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(region)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
                <button 
                  onClick={() => setExpandedRegion(expandedRegion === region.id ? null : region.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {expandedRegion === region.id ? 
                    <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  }
                </button>
              </div>
            </div>

            {expandedRegion === region.id && (
              <div className="mt-4 space-y-4 border-t pt-4">
                {editingRegion === region.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Region Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Danger Level
                      </label>
                      <select
                        value={editForm.dangerLevel}
                        onChange={(e) => setEditForm(prev => ({ ...prev, dangerLevel: e.target.value as any }))}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="critical">Critical (Red)</option>
                        <option value="warning">Warning (Yellow)</option>
                        <option value="safe">Safe (Green)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confidence Score
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editForm.confidence}
                        onChange={(e) => setEditForm(prev => ({ ...prev, confidence: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          References
                        </label>
                        <button
                          onClick={handleAddReference}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" /> Add Reference
                        </button>
                      </div>
                      {editForm.references.map((ref, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            placeholder="Title"
                            value={ref.title}
                            onChange={(e) => {
                              const newRefs = [...editForm.references];
                              newRefs[index].title = e.target.value;
                              setEditForm(prev => ({ ...prev, references: newRefs }));
                            }}
                            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                          />
                          <input
                            placeholder="Source"
                            value={ref.source}
                            onChange={(e) => {
                              const newRefs = [...editForm.references];
                              newRefs[index].source = e.target.value;
                              setEditForm(prev => ({ ...prev, references: newRefs }));
                            }}
                            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                          />
                          <button
                            onClick={() => handleRemoveReference(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => setEditingRegion(null)}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setEditingRegion(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode content
                  <div className="space-y-2">
                    <p className="text-gray-700 dark:text-gray-300">{region.details.description}</p>
                    {region.details.report && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Report Details</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(region.details.report).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-2 gap-2">
                              <span className="text-gray-600 dark:text-gray-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-gray-900 dark:text-gray-100">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}