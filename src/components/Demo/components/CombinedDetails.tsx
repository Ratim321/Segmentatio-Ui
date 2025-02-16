import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { Polygon } from "../types";
import { COLORS } from "../utils/helpers";

interface CombinedDetailsProps {
  polygons: Polygon[];
  editingPolygon: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Polygon>) => void;
}

interface EditFormState {
  name: string;
  details: string;
  confidence: string;
  references: Reference[];
}

export function CombinedDetails({
  polygons,
  editingPolygon,
  onEdit,
  onDelete,
  onUpdate,
}: CombinedDetailsProps) {
  const [editForm, setEditForm] = useState<EditFormState>({
    name: '',
    details: '',
    confidence: '',
    references: []
  });

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const updateReference = (index: number, field: keyof Reference, value: string) => {
    setEditForm(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  useEffect(() => {
    if (editingPolygon) {
      const polygon = polygons.find((p) => p.id === editingPolygon);
      if (polygon) {
        setEditForm({
          name: polygon.name || '',
          details: polygon.details || '',
          confidence: polygon.confidence?.toString() || '',
          references: polygon.references || []
        });
      }
    }
  }, [editingPolygon, polygons]);

  const handleSave = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(id, {
      name: editForm.name,
      details: editForm.details,
      confidence: parseFloat(editForm.confidence),
      references: editForm.references
    });
    onEdit('');
  };

  const addReference = () => {
    setEditForm(prev => ({
      ...prev,
      references: [...prev.references, { title: '', source: '' }]
    }));
  };

  const removeReference = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Segmentation Details & Findings</h4>
        <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
      </div>

      <div className="space-y-4">
        {polygons.map((polygon) => {
          const isEditing = editingPolygon === polygon.id;
          const isExpanded = expandedItems.includes(polygon.id);
          const colorIndex = parseInt(polygon.color);
    
          return (
            <div key={polygon.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4">
                {isEditing ? (
                  <form className="space-y-4" onSubmit={(e) => handleSave(polygon.id, e)}>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Region Name
                      </label>
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="border w-full rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        placeholder="Region name"
                      />
                    </div>
    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Details
                      </label>
                      <textarea
                        value={editForm.details}
                        onChange={(e) => setEditForm(prev => ({ ...prev, details: e.target.value }))}
                        className="border w-full rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        rows={3}
                        placeholder="Region details and findings"
                      />
                    </div>
    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Confidence Score (%)
                      </label>
                      <input
                        type="number"
                        value={editForm.confidence}
                        onChange={(e) => setEditForm(prev => ({ ...prev, confidence: e.target.value }))}
                        className="border w-full rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        References
                      </label>
                      {editForm.references.map((ref, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            value={ref.title}
                            onChange={(e) => updateReference(index, 'title', e.target.value)}
                            className="border flex-1 rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            placeholder="Reference title"
                          />
                          <input
                            value={ref.source}
                            onChange={(e) => updateReference(index, 'source', e.target.value)}
                            className="border flex-1 rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            placeholder="Source"
                          />
                          <button
                            type="button"
                            onClick={() => removeReference(index)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addReference}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        + Add Reference
                      </button>
                    </div>
    
                    <div className="flex gap-2">
                      <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                        <Save className="w-4 h-4 inline mr-1" />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit('')}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded text-sm"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${COLORS[colorIndex].bg}`} />
                        <h5 className="font-medium text-gray-900 dark:text-gray-100">{polygon.name}</h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">{polygon.confidence}% confidence</span>
                        <button onClick={() => onEdit(polygon.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button onClick={() => onDelete(polygon.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button onClick={() => toggleExpand(polygon.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                        </button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-3">
                        <div 
                          className="
                            relative
                            text-sm text-gray-600 dark:text-gray-300 
                            bg-white/90 dark:bg-gray-800/90 
                            backdrop-blur-lg 
                            border border-gray-200/50 dark:border-gray-700/50
                            shadow-lg 
                            rounded-xl 
                            p-4
                            w-full
                            whitespace-pre-wrap
                            break-words
                          "
                        >
                          <div className="space-y-3">
                            <p className="leading-relaxed">{polygon.details}</p>
                            {polygon.references && polygon.references.length > 0 && (
                              <div className="text-xs text-gray-500 border-t border-gray-200/50 dark:border-gray-700/50 pt-3 mt-3">
                                <p className="font-medium mb-2">References:</p>
                                {polygon.references.map((ref, idx) => (
                                  <p key={idx} className="mb-1.5">
                                    {ref.title} ({ref.source})
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
